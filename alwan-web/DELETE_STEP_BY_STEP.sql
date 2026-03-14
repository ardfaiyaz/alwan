-- ============================================================================
-- DELETE USER STEP BY STEP
-- User ID: 078fa78b-4d48-420f-b386-46813d1adf52
-- ============================================================================
-- Run each query ONE AT A TIME
-- If you get an error, skip that query and move to the next one
-- ============================================================================

-- STEP 1: Delete KYC Application
DELETE FROM public.kyc_applications 
WHERE user_id = '078fa78b-4d48-420f-b386-46813d1adf52';
-- Expected: DELETE 1 (or DELETE 0 if already deleted)

-- STEP 2: Delete Legal Consents
DELETE FROM public.legal_consents 
WHERE user_id = '078fa78b-4d48-420f-b386-46813d1adf52';
-- Expected: DELETE X (where X is number of consents)

-- STEP 3: Delete Profile
DELETE FROM public.profiles 
WHERE id = '078fa78b-4d48-420f-b386-46813d1adf52';
-- Expected: DELETE 1 (or DELETE 0 if no profile)

-- STEP 4: Delete Auth User
DELETE FROM auth.users 
WHERE id = '078fa78b-4d48-420f-b386-46813d1adf52';
-- Expected: DELETE 1
-- If you get "permission denied", go to Authentication > Users and delete manually

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- Run this to check if user is completely deleted:

SELECT COUNT(*) as kyc_count 
FROM public.kyc_applications 
WHERE user_id = '078fa78b-4d48-420f-b386-46813d1adf52';
-- Should return: 0

SELECT COUNT(*) as auth_count 
FROM auth.users 
WHERE id = '078fa78b-4d48-420f-b386-46813d1adf52';
-- Should return: 0

-- ============================================================================
-- DONE!
-- ============================================================================
-- Now delete storage files:
-- 1. Go to Storage > member-documents
-- 2. Navigate to: kyc/078fa78b-4d48-420f-b386-46813d1adf52/
-- 3. Delete the folder
-- ============================================================================
