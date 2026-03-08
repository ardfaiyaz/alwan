-- Create storage bucket for member documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('member-documents', 'member-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
-- Allow authenticated users to upload documents
CREATE POLICY "Allow authenticated users to upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'member-documents');

-- Allow anonymous users to upload to temp folder during signup
CREATE POLICY "Allow anonymous uploads to temp folder"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (
  bucket_id = 'member-documents' 
  AND (storage.foldername(name))[1] = 'temp'
);

-- Allow public read access to documents
CREATE POLICY "Allow public read access to documents"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'member-documents');

-- Allow users to update their own documents
CREATE POLICY "Allow users to update their own documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'member-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own documents
CREATE POLICY "Allow users to delete their own documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'member-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to delete temp files
CREATE POLICY "Allow cleanup of temp files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'member-documents' AND (storage.foldername(name))[1] = 'temp');
