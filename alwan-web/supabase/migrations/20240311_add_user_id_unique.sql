-- Add UNIQUE constraint to user_id in kyc_applications table
-- This allows upsert operations based on user_id

-- First, remove any duplicate user_id entries (keep the most recent one)
DELETE FROM public.kyc_applications a
USING public.kyc_applications b
WHERE a.user_id = b.user_id 
  AND a.created_at < b.created_at;

-- Now add the UNIQUE constraint
ALTER TABLE public.kyc_applications
ADD CONSTRAINT kyc_applications_user_id_key UNIQUE (user_id);

-- Add comment explaining why this constraint exists
COMMENT ON CONSTRAINT kyc_applications_user_id_key ON public.kyc_applications 
IS 'Ensures one KYC application per user. Allows upsert operations during signup flow.';
