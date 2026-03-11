-- Add metadata column to kyc_applications to store complete form data
-- This allows us to store all KYC information before center assignment

ALTER TABLE public.kyc_applications
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;

-- Add comment explaining the metadata structure
COMMENT ON COLUMN public.kyc_applications.metadata IS 'Complete KYC form data including personal info, address, business, financial, identity verification, guarantor, and documents';

-- Create index for faster JSON queries
CREATE INDEX IF NOT EXISTS idx_kyc_applications_metadata ON public.kyc_applications USING gin (metadata);

-- Add a function to extract key information from metadata
CREATE OR REPLACE FUNCTION get_kyc_applicant_name(metadata jsonb)
RETURNS text AS $$
BEGIN
  RETURN CONCAT(
    metadata->>'firstName', ' ',
    COALESCE(metadata->>'middleName', ''), ' ',
    metadata->>'lastName'
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create a view for easier querying of KYC applications with extracted data
CREATE OR REPLACE VIEW kyc_applications_view AS
SELECT 
  ka.id,
  ka.user_id,
  ka.mobile_number,
  ka.status,
  ka.kyc_level,
  ka.current_step,
  ka.submitted_at,
  ka.approved_at,
  ka.approved_by,
  ka.rejection_reason,
  ka.created_at,
  ka.updated_at,
  -- Extract key fields from metadata
  ka.metadata->>'firstName' as first_name,
  ka.metadata->>'middleName' as middle_name,
  ka.metadata->>'lastName' as last_name,
  ka.metadata->>'email' as email,
  ka.metadata->>'dateOfBirth' as date_of_birth,
  ka.metadata->>'gender' as gender,
  ka.metadata->'address'->>'city' as city,
  ka.metadata->'address'->>'province' as province,
  ka.metadata->'business'->>'businessName' as business_name,
  ka.metadata->'business'->>'businessType' as business_type,
  get_kyc_applicant_name(ka.metadata) as full_name
FROM public.kyc_applications ka;

-- Grant permissions
GRANT SELECT ON kyc_applications_view TO authenticated;
