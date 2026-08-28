/*
# Allow anon uploads to resumes bucket

The careers form is public (no sign-in), so the anon role needs INSERT
access on the resumes storage bucket. SELECT stays restricted to
authenticated (admin) users who review applications.
*/

DROP POLICY IF EXISTS "anon_insert_resumes" ON storage.objects;
CREATE POLICY "anon_insert_resumes" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'resumes');

-- Keep the authenticated-only SELECT for admins reviewing applications
DROP POLICY IF EXISTS "auth_select_resumes" ON storage.objects;
CREATE POLICY "auth_select_resumes" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'resumes');