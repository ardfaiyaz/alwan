# Run KYC Metadata Migration

The `metadata` column is missing from your `kyc_applications` table. You need to run the migration.

## Option 1: Via Supabase Dashboard (Recommended)

1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire contents of `supabase/migrations/20240311_add_kyc_metadata.sql`
6. Paste into the SQL Editor
7. Click **Run** or press `Ctrl+Enter`

## Option 2: Via Supabase CLI

If you have Supabase CLI installed:

```bash
cd alwan-web
supabase db push
```

Or run the specific migration:

```bash
cd alwan-web
supabase migration up
```

## Option 3: Manual SQL Execution

Connect to your database and run:

```sql
-- Add metadata column to kyc_applications
ALTER TABLE public.kyc_applications
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;

-- Add comment
COMMENT ON COLUMN public.kyc_applications.metadata IS 'Complete KYC form data including personal info, address, business, financial, identity verification, guarantor, and documents';

-- Create index
CREATE INDEX IF NOT EXISTS idx_kyc_applications_metadata ON public.kyc_applications USING gin (metadata);

-- Add helper function
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

-- Create view
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
```

## Verify Migration

After running, verify the column exists:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'kyc_applications' 
AND column_name = 'metadata';
```

You should see:
```
column_name | data_type
------------|----------
metadata    | jsonb
```

## After Migration

Once the migration is complete, try submitting the KYC application again. The error should be resolved.
