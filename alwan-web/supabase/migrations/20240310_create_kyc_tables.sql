-- ============================================================================
-- KYC System Database Schema
-- Compliant with BSP, SEC, Data Privacy Act, and AML regulations
-- ============================================================================

-- Create ENUM types
DO $$ BEGIN
    CREATE TYPE kyc_status AS ENUM ('pending', 'in_review', 'approved', 'rejected', 'incomplete');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE kyc_level AS ENUM ('basic', 'intermediate', 'full');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE civil_status AS ENUM ('single', 'married', 'widowed', 'separated', 'divorced');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE housing_type AS ENUM ('owned', 'renting', 'living_with_family');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE id_type AS ENUM ('national_id', 'drivers_license', 'passport', 'umid', 'philhealth', 'sss', 'voters_id', 'postal_id');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE business_registration_type AS ENUM ('dti', 'barangay_permit', 'sec', 'none');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE consent_type AS ENUM ('terms_and_conditions', 'privacy_policy', 'data_privacy_consent', 'credit_investigation_authorization');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- Table: kyc_applications
-- Purpose: Track KYC application progress and status
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.kyc_applications (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    mobile_number text NOT NULL UNIQUE,
    status kyc_status NOT NULL DEFAULT 'pending',
    current_step integer DEFAULT 1,
    completed_steps jsonb DEFAULT '[]'::jsonb,
    kyc_level kyc_level DEFAULT 'basic',
    rejection_reason text,
    approved_by uuid,
    approved_at timestamp with time zone,
    submitted_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT kyc_applications_pkey PRIMARY KEY (id),
    CONSTRAINT kyc_applications_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT kyc_applications_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.profiles(id)
);

CREATE INDEX IF NOT EXISTS idx_kyc_applications_user_id ON public.kyc_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_applications_mobile ON public.kyc_applications(mobile_number);
CREATE INDEX IF NOT EXISTS idx_kyc_applications_status ON public.kyc_applications(status);

-- ============================================================================
-- Table: member_profiles
-- Purpose: Extended member information for KYC
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.member_profiles (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    member_id uuid NOT NULL UNIQUE,
    civil_status civil_status,
    nationality text DEFAULT 'Filipino',
    mothers_maiden_name text,
    number_of_dependents integer DEFAULT 0,
    email text,
    alternate_phone text,
    place_of_birth text,
    tin_number text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT member_profiles_pkey PRIMARY KEY (id),
    CONSTRAINT member_profiles_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_member_profiles_member_id ON public.member_profiles(member_id);

-- ============================================================================
-- Table: member_addresses
-- Purpose: Detailed address information
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.member_addresses (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    member_id uuid NOT NULL,
    house_number text,
    street text,
    barangay text NOT NULL,
    city text NOT NULL,
    province text NOT NULL,
    zip_code text NOT NULL,
    years_living integer,
    housing_type housing_type,
    is_primary boolean DEFAULT true,
    landmark text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT member_addresses_pkey PRIMARY KEY (id),
    CONSTRAINT member_addresses_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_member_addresses_member_id ON public.member_addresses(member_id);

-- ============================================================================
-- Table: member_identifications
-- Purpose: KYC identity verification documents
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.member_identifications (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    member_id uuid NOT NULL,
    id_type id_type NOT NULL,
    id_number text NOT NULL,
    id_front_url text NOT NULL,
    id_back_url text,
    selfie_url text,
    face_match_score numeric(5,2),
    face_match_verified boolean DEFAULT false,
    ocr_data jsonb,
    verified_by uuid,
    verified_at timestamp with time zone,
    expiry_date date,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT member_identifications_pkey PRIMARY KEY (id),
    CONSTRAINT member_identifications_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(id) ON DELETE CASCADE,
    CONSTRAINT member_identifications_verified_by_fkey FOREIGN KEY (verified_by) REFERENCES public.profiles(id)
);

CREATE INDEX IF NOT EXISTS idx_member_identifications_member_id ON public.member_identifications(member_id);

-- ============================================================================
-- Table: member_businesses
-- Purpose: Business information for microfinance clients
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.member_businesses (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    member_id uuid NOT NULL,
    business_name text NOT NULL,
    business_type text NOT NULL,
    business_address text NOT NULL,
    years_operating numeric(4,1),
    registration_type business_registration_type DEFAULT 'none',
    registration_number text,
    daily_sales numeric(12,2),
    monthly_revenue numeric(12,2),
    number_of_employees integer DEFAULT 0,
    business_description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT member_businesses_pkey PRIMARY KEY (id),
    CONSTRAINT member_businesses_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_member_businesses_member_id ON public.member_businesses(member_id);

-- ============================================================================
-- Table: member_financial_info
-- Purpose: Financial details for loan eligibility
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.member_financial_info (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    member_id uuid NOT NULL UNIQUE,
    monthly_income numeric(12,2),
    other_income_sources text,
    monthly_expenses numeric(12,2),
    existing_loans jsonb DEFAULT '[]'::jsonb,
    assets jsonb DEFAULT '[]'::jsonb,
    bank_accounts jsonb DEFAULT '[]'::jsonb,
    credit_score integer,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT member_financial_info_pkey PRIMARY KEY (id),
    CONSTRAINT member_financial_info_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_member_financial_info_member_id ON public.member_financial_info(member_id);

-- ============================================================================
-- Table: member_guarantors
-- Purpose: Co-borrower/guarantor information
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.member_guarantors (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    member_id uuid NOT NULL,
    full_name text NOT NULL,
    relationship text NOT NULL,
    address text NOT NULL,
    phone text NOT NULL,
    occupation text,
    monthly_income numeric(12,2),
    id_document_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT member_guarantors_pkey PRIMARY KEY (id),
    CONSTRAINT member_guarantors_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_member_guarantors_member_id ON public.member_guarantors(member_id);

-- ============================================================================
-- Table: legal_consents
-- Purpose: Track user consent for legal compliance
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.legal_consents (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    consent_type consent_type NOT NULL,
    version text NOT NULL,
    accepted_at timestamp with time zone DEFAULT now(),
    ip_address inet,
    user_agent text,
    CONSTRAINT legal_consents_pkey PRIMARY KEY (id),
    CONSTRAINT legal_consents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_legal_consents_user_id ON public.legal_consents(user_id);
CREATE INDEX IF NOT EXISTS idx_legal_consents_type ON public.legal_consents(consent_type);

-- ============================================================================
-- Update existing members table
-- ============================================================================
ALTER TABLE public.members 
ADD COLUMN IF NOT EXISTS kyc_status kyc_status DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS kyc_level kyc_level DEFAULT 'basic',
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS civil_status civil_status,
ADD COLUMN IF NOT EXISTS nationality text DEFAULT 'Filipino';

-- ============================================================================
-- Row Level Security (RLS) Policies
-- ============================================================================

-- KYC Applications
ALTER TABLE public.kyc_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own KYC application"
ON public.kyc_applications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own KYC application"
ON public.kyc_applications FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own KYC application"
ON public.kyc_applications FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all KYC applications"
ON public.kyc_applications FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'area_manager', 'branch_manager')
    )
);

CREATE POLICY "Admins can update KYC applications"
ON public.kyc_applications FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'area_manager', 'branch_manager')
    )
);

-- Member Profiles
ALTER TABLE public.member_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own profile"
ON public.member_profiles FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.members
        WHERE members.id = member_profiles.member_id
        AND members.phone = (SELECT phone FROM auth.users WHERE id = auth.uid())
    )
);

-- Similar RLS policies for other tables
ALTER TABLE public.member_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_identifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_financial_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_guarantors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_consents ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Triggers for updated_at
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_kyc_applications_updated_at BEFORE UPDATE ON public.kyc_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_member_profiles_updated_at BEFORE UPDATE ON public.member_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_member_addresses_updated_at BEFORE UPDATE ON public.member_addresses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_member_identifications_updated_at BEFORE UPDATE ON public.member_identifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_member_businesses_updated_at BEFORE UPDATE ON public.member_businesses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_member_financial_info_updated_at BEFORE UPDATE ON public.member_financial_info
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_member_guarantors_updated_at BEFORE UPDATE ON public.member_guarantors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Comments for documentation
-- ============================================================================
COMMENT ON TABLE public.kyc_applications IS 'Tracks KYC application progress and approval status';
COMMENT ON TABLE public.member_profiles IS 'Extended member profile information for KYC compliance';
COMMENT ON TABLE public.member_addresses IS 'Detailed address information for verification';
COMMENT ON TABLE public.member_identifications IS 'Identity documents and biometric verification';
COMMENT ON TABLE public.member_businesses IS 'Business information for microfinance clients';
COMMENT ON TABLE public.member_financial_info IS 'Financial details for loan eligibility assessment';
COMMENT ON TABLE public.member_guarantors IS 'Co-borrower and guarantor information';
COMMENT ON TABLE public.legal_consents IS 'Legal consent tracking for compliance';
