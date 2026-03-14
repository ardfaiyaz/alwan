-- ============================================================================
-- QUICK DELETE USER DATA
-- User ID: 078fa78b-4d48-420f-b386-46813d1adf52
-- ============================================================================
-- Copy and paste this into Supabase SQL Editor and run it
-- ============================================================================

-- Delete in correct order (child tables first, then parent tables)

-- 1. Delete approval-related data
DELETE FROM public.application_notes 
WHERE application_id IN (
    SELECT id FROM public.kyc_applications 
    WHERE user_id = '078fa78b-4d48-420f-b386-46813d1adf52'
);

DELETE FROM public.approval_audit_trail 
WHERE application_id IN (
    SELECT id FROM public.kyc_applications 
    WHERE user_id = '078fa78b-4d48-420f-b386-46813d1adf52'
);

-- 2. Delete member-related data (if exists)
DELETE FROM public.member_guarantors 
WHERE member_id IN (
    SELECT m.id FROM public.members m
    JOIN public.kyc_applications k ON m.phone = k.mobile_number
    WHERE k.user_id = '078fa78b-4d48-420f-b386-46813d1adf52'
);

DELETE FROM public.member_financial_info 
WHERE member_id IN (
    SELECT m.id FROM public.members m
    JOIN public.kyc_applications k ON m.phone = k.mobile_number
    WHERE k.user_id = '078fa78b-4d48-420f-b386-46813d1adf52'
);

DELETE FROM public.member_businesses 
WHERE member_id IN (
    SELECT m.id FROM public.members m
    JOIN public.kyc_applications k ON m.phone = k.mobile_number
    WHERE k.user_id = '078fa78b-4d48-420f-b386-46813d1adf52'
);

DELETE FROM public.member_identifications 
WHERE member_id IN (
    SELECT m.id FROM public.members m
    JOIN public.kyc_applications k ON m.phone = k.mobile_number
    WHERE k.user_id = '078fa78b-4d48-420f-b386-46813d1adf52'
);

DELETE FROM public.member_addresses 
WHERE member_id IN (
    SELECT m.id FROM public.members m
    JOIN public.kyc_applications k ON m.phone = k.mobile_number
    WHERE k.user_id = '078fa78b-4d48-420f-b386-46813d1adf52'
);

DELETE FROM public.member_profiles 
WHERE member_id IN (
    SELECT m.id FROM public.members m
    JOIN public.kyc_applications k ON m.phone = k.mobile_number
    WHERE k.user_id = '078fa78b-4d48-420f-b386-46813d1adf52'
);

DELETE FROM public.member_documents 
WHERE member_id IN (
    SELECT m.id FROM public.members m
    JOIN public.kyc_applications k ON m.phone = k.mobile_number
    WHERE k.user_id = '078fa78b-4d48-420f-b386-46813d1adf52'
);

DELETE FROM public.members 
WHERE phone IN (
    SELECT mobile_number FROM public.kyc_applications 
    WHERE user_id = '078fa78b-4d48-420f-b386-46813d1adf52'
);

-- 3. Delete KYC and legal data
DELETE FROM public.legal_consents 
WHERE user_id = '078fa78b-4d48-420f-b386-46813d1adf52';

DELETE FROM public.kyc_applications 
WHERE user_id = '078fa78b-4d48-420f-b386-46813d1adf52';

-- 4. Delete profile
DELETE FROM public.profiles 
WHERE id = '078fa78b-4d48-420f-b386-46813d1adf52';

-- 5. Delete auth user (requires admin privileges)
DELETE FROM auth.users 
WHERE id = '078fa78b-4d48-420f-b386-46813d1adf52';

-- ============================================================================
-- DONE! Now verify with this query (should return all 0s):
-- ============================================================================

SELECT 
    'kyc_applications' as table_name, 
    COUNT(*) as remaining_records 
FROM public.kyc_applications 
WHERE user_id = '078fa78b-4d48-420f-b386-46813d1adf52'
UNION ALL
SELECT 'auth.users', COUNT(*) 
FROM auth.users 
WHERE id = '078fa78b-4d48-420f-b386-46813d1adf52';
