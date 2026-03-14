-- ============================================================================
-- SIMPLE DELETE USER - Handles missing tables
-- User ID: 078fa78b-4d48-420f-b386-46813d1adf52
-- ============================================================================
-- This version skips tables that don't exist
-- ============================================================================

-- 1. Delete KYC application (most important)
DELETE FROM public.kyc_applications 
WHERE user_id = '078fa78b-4d48-420f-b386-46813d1adf52';

-- 2. Delete legal consents
DELETE FROM public.legal_consents 
WHERE user_id = '078fa78b-4d48-420f-b386-46813d1adf52';

-- 3. Delete profile
DELETE FROM public.profiles 
WHERE id = '078fa78b-4d48-420f-b386-46813d1adf52';

-- 4. Delete auth user
DELETE FROM auth.users 
WHERE id = '078fa78b-4d48-420f-b386-46813d1adf52';

-- ============================================================================
-- VERIFICATION - Should return 0 for all
-- ============================================================================
SELECT 
    'kyc_applications' as table_name, 
    COUNT(*) as count 
FROM public.kyc_applications 
WHERE user_id = '078fa78b-4d48-420f-b386-46813d1adf52'
UNION ALL
SELECT 'legal_consents', COUNT(*) 
FROM public.legal_consents 
WHERE user_id = '078fa78b-4d48-420f-b386-46813d1adf52'
UNION ALL
SELECT 'profiles', COUNT(*) 
FROM public.profiles 
WHERE id = '078fa78b-4d48-420f-b386-46813d1adf52'
UNION ALL
SELECT 'auth.users', COUNT(*) 
FROM auth.users 
WHERE id = '078fa78b-4d48-420f-b386-46813d1adf52';
