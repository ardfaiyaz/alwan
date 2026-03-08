-- Create member_documents table
CREATE TABLE IF NOT EXISTS public.member_documents (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    member_id uuid NOT NULL,
    document_type text NOT NULL,
    file_name text NOT NULL,
    file_url text NOT NULL,
    file_size bigint NOT NULL,
    mime_type text NOT NULL,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    uploaded_by uuid,
    verified_by uuid,
    verified_at timestamp with time zone,
    rejection_reason text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT member_documents_pkey PRIMARY KEY (id),
    CONSTRAINT member_documents_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(id) ON DELETE CASCADE,
    CONSTRAINT member_documents_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES auth.users(id),
    CONSTRAINT member_documents_verified_by_fkey FOREIGN KEY (verified_by) REFERENCES public.profiles(id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_member_documents_member_id ON public.member_documents(member_id);
CREATE INDEX IF NOT EXISTS idx_member_documents_status ON public.member_documents(status);
CREATE INDEX IF NOT EXISTS idx_member_documents_created_at ON public.member_documents(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.member_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Allow authenticated users to insert their own documents
CREATE POLICY "Users can insert their own documents"
ON public.member_documents FOR INSERT
TO authenticated
WITH CHECK (uploaded_by = auth.uid());

-- Allow users to view their own documents
CREATE POLICY "Users can view their own documents"
ON public.member_documents FOR SELECT
TO authenticated
USING (uploaded_by = auth.uid());

-- Allow admin/staff to view all documents
CREATE POLICY "Admin can view all documents"
ON public.member_documents FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'area_manager', 'branch_manager')
    )
);

-- Allow admin/staff to update documents
CREATE POLICY "Admin can update documents"
ON public.member_documents FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'area_manager', 'branch_manager')
    )
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_member_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_member_documents_updated_at
    BEFORE UPDATE ON public.member_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_member_documents_updated_at();
