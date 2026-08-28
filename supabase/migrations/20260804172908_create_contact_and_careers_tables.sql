/*
# Create contact_submissions and career_applications tables

## contact_submissions
Stores enquiries from the public Contact Us form. No auth required — anyone can submit.
- id, name, email, phone, company, service, message, created_at

## career_applications
Stores job applications submitted by signed-in users via the Careers form.
- id, user_id (FK to auth.users), name, email, phone, position, experience, message, created_at

## Security
- contact_submissions: RLS enabled. Public (anon + authenticated) can INSERT. No SELECT for public (admin reads via service role).
- career_applications: RLS enabled. Authenticated users can INSERT their own rows. Users can SELECT only their own rows.
*/

-- ─── contact_submissions ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_submissions (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text        NOT NULL,
  email      text        NOT NULL,
  phone      text,
  company    text,
  service    text,
  message    text        NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_contact" ON contact_submissions;
CREATE POLICY "public_insert_contact" ON contact_submissions
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- ─── career_applications ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS career_applications (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name        text        NOT NULL,
  email       text        NOT NULL,
  phone       text        NOT NULL,
  position    text        NOT NULL,
  experience  text        NOT NULL,
  message     text,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE career_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_insert_application" ON career_applications;
CREATE POLICY "auth_insert_application" ON career_applications
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "auth_select_own_application" ON career_applications;
CREATE POLICY "auth_select_own_application" ON career_applications
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
