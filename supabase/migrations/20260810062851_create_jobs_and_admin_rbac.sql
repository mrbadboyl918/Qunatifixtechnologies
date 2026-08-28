/*
# Jobs Board + Admin Role-Based Access Control (RBAC)

## Overview
Creates a full job management system with strict admin-only access.
The admin role is stored in `raw_app_meta_data` (user-immutable) and verified
server-side in SECURITY DEFINER functions. The frontend never trusts its own
role check for security — every admin API call is independently verified by the database.

## Admin Account
The email "quantifixtechnologies@outlook.com" is configured as admin via a
trigger that runs on user creation. The role lives in `raw_app_meta_data`
which is NOT editable by the user (unlike `raw_user_meta_data`).

## New Tables

### jobs
- id (uuid, PK)
- title (text, required)
- department (text)
- location (text)
- job_type (text: Full-time / Part-time / Contract / Internship)
- experience_level (text)
- description (text)
- requirements (text)
- application_link (text — external URL or mailto)
- salary_range (text)
- status (text: draft / published / archived, default 'draft')
- is_featured (boolean, default false)
- created_by (uuid, FK to auth.users, defaults to auth.uid())
- created_at (timestamptz)
- updated_at (timestamptz)

### admin_activity_logs
- id (uuid, PK)
- admin_id (uuid, FK to auth.users)
- action (text: create / update / delete / publish / unpublish / feature / unfeature / archive)
- entity_type (text, default 'job')
- entity_id (uuid, nullable)
- details (jsonb)
- created_at (timestamptz)

## Security

### Admin role assignment
- A trigger function `set_admin_role()` runs BEFORE INSERT on auth.users.
- If the email matches the authorized admin email, it sets `raw_app_meta_data.role = 'admin'`.
- This is server-side only — the user cannot self-assign the admin role.

### Admin verification function
- `is_admin()` SECURITY DEFINER function checks `raw_app_meta_data` for the calling user.
- Used by all admin SECURITY DEFINER mutation functions and RLS policies.

### Jobs RLS policies
- SELECT: anyone (anon + authenticated) can read published jobs.
  Authenticated admins can read ALL jobs (including drafts/archived).
- INSERT/UPDATE/DELETE: NO direct table access for any role.
  All mutations go through SECURITY DEFINER functions that verify admin role.

### Admin mutation functions (SECURITY DEFINER)
- `admin_create_job(p_job jsonb)` — creates a job, logs activity
- `admin_update_job(p_id uuid, p_updates jsonb)` — updates a job, logs activity
- `admin_delete_job(p_id uuid)` — deletes a job, logs activity
- `admin_set_job_status(p_id uuid, p_status text)` — publish/unpublish/archive, logs activity
- `admin_toggle_featured(p_id uuid, p_featured boolean)` — toggle featured flag, logs activity

### Admin activity logs RLS
- SELECT: admin only (via is_admin() check)
- INSERT: only via SECURITY DEFINER functions (no direct access)
- No UPDATE/DELETE allowed

## Important Notes
1. The admin email is hardcoded in the trigger function. To change admins,
   update the trigger or manually set raw_app_meta_data.
2. `raw_app_meta_data` is used (not `raw_user_meta_data`) because the user
   cannot modify it from the client — it's only settable server-side.
3. All admin functions use `SET search_path = public` to prevent search_path attacks.
4. EXECUTE on admin functions is revoked from anon, granted to authenticated only.
*/

-- ============================================================
-- 1. ADMIN ROLE VERIFICATION FUNCTION (must exist before policies)
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND raw_app_meta_data->>'role' = 'admin'
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- ============================================================
-- 2. ADMIN ROLE ASSIGNMENT TRIGGER
--    Sets role='admin' for the authorized email on signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_admin_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'quantifixtechnologies@outlook.com' THEN
    NEW.raw_app_meta_data = COALESCE(NEW.raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', 'admin');
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.set_admin_role() FROM anon, authenticated;

DROP TRIGGER IF EXISTS set_admin_role_on_signup ON auth.users;
CREATE TRIGGER set_admin_role_on_signup
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.set_admin_role();

-- ============================================================
-- 3. JOBS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  department text,
  location text,
  job_type text DEFAULT 'Full-time',
  experience_level text,
  description text,
  requirements text,
  application_link text,
  salary_range text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_featured boolean NOT NULL DEFAULT false,
  created_by uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Public can read published jobs; admins can read all
DROP POLICY IF EXISTS "public_read_published_jobs" ON jobs;
CREATE POLICY "public_read_published_jobs" ON jobs FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

DROP POLICY IF EXISTS "admin_read_all_jobs" ON jobs;
CREATE POLICY "admin_read_all_jobs" ON jobs FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- No direct INSERT/UPDATE/DELETE for anyone — mutations go through functions
REVOKE INSERT ON jobs FROM anon, authenticated;
REVOKE UPDATE ON jobs FROM anon, authenticated;
REVOKE DELETE ON jobs FROM anon, authenticated;

GRANT SELECT ON jobs TO anon, authenticated;

-- ============================================================
-- 4. ADMIN ACTIVITY LOGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text NOT NULL DEFAULT 'job',
  entity_id uuid,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_read_activity_logs" ON admin_activity_logs;
CREATE POLICY "admin_read_activity_logs" ON admin_activity_logs FOR SELECT
  TO authenticated
  USING (public.is_admin());

REVOKE INSERT ON admin_activity_logs FROM anon, authenticated;
REVOKE UPDATE ON admin_activity_logs FROM anon, authenticated;
REVOKE DELETE ON admin_activity_logs FROM anon, authenticated;

GRANT SELECT ON admin_activity_logs TO authenticated;

-- ============================================================
-- 5. ADMIN_create_job
-- ============================================================
CREATE OR REPLACE FUNCTION public.admin_create_job(p_job jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_id uuid;
  v_admin_id uuid := auth.uid();
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Not authorized: admin access required';
  END IF;

  INSERT INTO jobs (
    title, department, location, job_type, experience_level,
    description, requirements, application_link, salary_range,
    status, is_featured, created_by
  ) VALUES (
    p_job->>'title',
    p_job->>'department',
    p_job->>'location',
    COALESCE(p_job->>'job_type', 'Full-time'),
    p_job->>'experience_level',
    p_job->>'description',
    p_job->>'requirements',
    p_job->>'application_link',
    p_job->>'salary_range',
    COALESCE(p_job->>'status', 'draft'),
    COALESCE((p_job->>'is_featured')::boolean, false),
    v_admin_id
  )
  RETURNING id INTO v_id;

  INSERT INTO admin_activity_logs (admin_id, action, entity_type, entity_id, details)
  VALUES (v_admin_id, 'create', 'job', v_id, p_job);

  RETURN jsonb_build_object('id', v_id, 'success', true);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.admin_create_job(jsonb) FROM anon;
GRANT EXECUTE ON FUNCTION public.admin_create_job(jsonb) TO authenticated;

-- ============================================================
-- 6. admin_update_job
-- ============================================================
CREATE OR REPLACE FUNCTION public.admin_update_job(p_id uuid, p_updates jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_admin_id uuid := auth.uid();
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Not authorized: admin access required';
  END IF;

  UPDATE jobs SET
    title = COALESCE(p_updates->>'title', title),
    department = COALESCE(p_updates->>'department', department),
    location = COALESCE(p_updates->>'location', location),
    job_type = COALESCE(p_updates->>'job_type', job_type),
    experience_level = COALESCE(p_updates->>'experience_level', experience_level),
    description = COALESCE(p_updates->>'description', description),
    requirements = COALESCE(p_updates->>'requirements', requirements),
    application_link = COALESCE(p_updates->>'application_link', application_link),
    salary_range = COALESCE(p_updates->>'salary_range', salary_range),
    status = COALESCE(p_updates->>'status', status),
    is_featured = COALESCE((p_updates->>'is_featured')::boolean, is_featured),
    updated_at = now()
  WHERE id = p_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Job not found';
  END IF;

  INSERT INTO admin_activity_logs (admin_id, action, entity_type, entity_id, details)
  VALUES (v_admin_id, 'update', 'job', p_id, p_updates);

  RETURN jsonb_build_object('id', p_id, 'success', true);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.admin_update_job(uuid, jsonb) FROM anon;
GRANT EXECUTE ON FUNCTION public.admin_update_job(uuid, jsonb) TO authenticated;

-- ============================================================
-- 7. admin_delete_job
-- ============================================================
CREATE OR REPLACE FUNCTION public.admin_delete_job(p_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_admin_id uuid := auth.uid();
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Not authorized: admin access required';
  END IF;

  DELETE FROM jobs WHERE id = p_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Job not found';
  END IF;

  INSERT INTO admin_activity_logs (admin_id, action, entity_type, entity_id)
  VALUES (v_admin_id, 'delete', 'job', p_id);

  RETURN jsonb_build_object('id', p_id, 'success', true);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.admin_delete_job(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.admin_delete_job(uuid) TO authenticated;

-- ============================================================
-- 8. admin_set_job_status (publish / unpublish / archive)
-- ============================================================
CREATE OR REPLACE FUNCTION public.admin_set_job_status(p_id uuid, p_status text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_admin_id uuid := auth.uid();
  v_action text;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Not authorized: admin access required';
  END IF;

  IF p_status NOT IN ('draft', 'published', 'archived') THEN
    RAISE EXCEPTION 'Invalid status';
  END IF;

  UPDATE jobs SET status = p_status, updated_at = now() WHERE id = p_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Job not found';
  END IF;

  v_action := CASE p_status WHEN 'published' THEN 'publish' WHEN 'archived' THEN 'archive' ELSE 'unpublish' END;

  INSERT INTO admin_activity_logs (admin_id, action, entity_type, entity_id, details)
  VALUES (v_admin_id, v_action, 'job', p_id, jsonb_build_object('status', p_status));

  RETURN jsonb_build_object('id', p_id, 'status', p_status, 'success', true);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.admin_set_job_status(uuid, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.admin_set_job_status(uuid, text) TO authenticated;

-- ============================================================
-- 9. admin_toggle_featured
-- ============================================================
CREATE OR REPLACE FUNCTION public.admin_toggle_featured(p_id uuid, p_featured boolean)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_admin_id uuid := auth.uid();
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Not authorized: admin access required';
  END IF;

  UPDATE jobs SET is_featured = p_featured, updated_at = now() WHERE id = p_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Job not found';
  END IF;

  INSERT INTO admin_activity_logs (admin_id, action, entity_type, entity_id, details)
  VALUES (v_admin_id, CASE WHEN p_featured THEN 'feature' ELSE 'unfeature' END, 'job', p_id, jsonb_build_object('is_featured', p_featured));

  RETURN jsonb_build_object('id', p_id, 'is_featured', p_featured, 'success', true);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.admin_toggle_featured(uuid, boolean) FROM anon;
GRANT EXECUTE ON FUNCTION public.admin_toggle_featured(uuid, boolean) TO authenticated;

-- ============================================================
-- 10. INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS jobs_status_idx ON jobs(status);
CREATE INDEX IF NOT EXISTS jobs_featured_idx ON jobs(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS admin_activity_logs_created_at_idx ON admin_activity_logs(created_at DESC);