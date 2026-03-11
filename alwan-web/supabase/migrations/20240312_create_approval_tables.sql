-- Create application_notes table
CREATE TABLE IF NOT EXISTS public.application_notes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL,
  admin_id uuid NOT NULL,
  admin_name text NOT NULL,
  note text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT application_notes_pkey PRIMARY KEY (id),
  CONSTRAINT application_notes_application_id_fkey FOREIGN KEY (application_id) 
    REFERENCES public.kyc_applications(id) ON DELETE CASCADE,
  CONSTRAINT application_notes_admin_id_fkey FOREIGN KEY (admin_id) 
    REFERENCES public.profiles(id)
);

-- Create approval_audit_trail table
CREATE TABLE IF NOT EXISTS public.approval_audit_trail (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL,
  action text NOT NULL CHECK (action IN ('viewed', 'approved', 'rejected', 'note_added', 'status_changed')),
  performed_by uuid NOT NULL,
  performed_by_name text NOT NULL,
  details text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT approval_audit_trail_pkey PRIMARY KEY (id),
  CONSTRAINT approval_audit_trail_application_id_fkey FOREIGN KEY (application_id) 
    REFERENCES public.kyc_applications(id) ON DELETE CASCADE,
  CONSTRAINT approval_audit_trail_performed_by_fkey FOREIGN KEY (performed_by) 
    REFERENCES public.profiles(id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_application_notes_application_id 
  ON public.application_notes(application_id);

CREATE INDEX IF NOT EXISTS idx_application_notes_created_at 
  ON public.application_notes(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_trail_application_id 
  ON public.approval_audit_trail(application_id);

CREATE INDEX IF NOT EXISTS idx_audit_trail_created_at 
  ON public.approval_audit_trail(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_trail_action 
  ON public.approval_audit_trail(action);

-- Enable Row Level Security
ALTER TABLE public.application_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_audit_trail ENABLE ROW LEVEL SECURITY;

-- RLS Policies for application_notes
CREATE POLICY "Admin can view all notes" ON public.application_notes
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'area_manager', 'branch_manager')
    )
  );

CREATE POLICY "Admin can insert notes" ON public.application_notes
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'area_manager', 'branch_manager')
    )
  );

CREATE POLICY "Admin can delete own notes" ON public.application_notes
  FOR DELETE
  USING (
    admin_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for approval_audit_trail
CREATE POLICY "Admin can view audit trail" ON public.approval_audit_trail
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'area_manager', 'branch_manager')
    )
  );

CREATE POLICY "System can insert audit trail" ON public.approval_audit_trail
  FOR INSERT
  WITH CHECK (true);

-- Grant permissions
GRANT SELECT, INSERT ON public.application_notes TO authenticated;
GRANT DELETE ON public.application_notes TO authenticated;
GRANT SELECT, INSERT ON public.approval_audit_trail TO authenticated;
