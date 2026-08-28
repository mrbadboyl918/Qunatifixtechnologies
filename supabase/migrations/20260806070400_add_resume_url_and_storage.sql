/*
# Add resume_url to career_applications + create resumes storage bucket

1. Changes
   - Adds optional `resume_url` column to `career_applications` table.
2. Storage
   - Creates a `resumes` storage bucket (private, 5 MB file size limit).
   - Grants authenticated users insert into `storage.objects` for the `resumes` bucket.
   - Grants authenticated users select their own uploaded objects.
*/

-- Add resume_url column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'career_applications' AND column_name = 'resume_url'
  ) THEN
    ALTER TABLE career_applications ADD COLUMN resume_url text;
  END IF;
END $$;

-- Create the resumes bucket (private, 5 MB limit)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resumes',
  'resumes',
  false,
  5242880,
  ARRAY['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies
DROP POLICY IF EXISTS "auth_insert_resumes" ON storage.objects;
CREATE POLICY "auth_insert_resumes" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'resumes');

DROP POLICY IF EXISTS "auth_select_own_resumes" ON storage.objects;
CREATE POLICY "auth_select_own_resumes" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
