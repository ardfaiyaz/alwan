-- Create storage bucket for member documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('member-documents', 'member-documents', true);

-- Set up storage policies
CREATE POLICY "Allow authenticated users to upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'member-documents');

CREATE POLICY "Allow public read access to documents"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'member-documents');

CREATE POLICY "Allow users to update their own documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'member-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Allow users to delete their own documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'member-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
