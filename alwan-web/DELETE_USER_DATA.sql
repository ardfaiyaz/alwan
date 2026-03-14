-- ============================================================================
-- DELETE USER DATA SCRIPT
-- User ID: 078fa78b-4d48-420f-b386-46813d1adf52
-- ============================================================================
-- IMPORTANT: Run this in Supabase SQL Editor
-- This will delete ALL data associated with this user
-- ============================================================================

-- Set the user ID variable for safety
DO $$
DECLARE
    target_user_id UUID := '078fa78b-4d48-420f-b386-46813d1adf52';
BEGIN
    RAISE NOTICE 'Starting deletion for user: %', target_user_id;

    -- ========================================================================
    -- 1. DELETE FROM KYC-RELATED TABLES
    -- ========================================================================
    
    -- Delete legal consents
    DELETE FROM public.legal_consents 
    WHERE user_id = target_user_id;
    RAISE NOTICE 'Deleted legal_consents';

    -- Delete KYC applications (this will cascade to related data)
    DELETE FROM public.kyc_applications 
    WHERE user_id = target_user_id;
    RAISE NOTICE 'Deleted kyc_applications';

    -- ========================================================================
    -- 2. DELETE FROM MEMBER-RELATED TABLES (if member was created)
    -- ========================================================================
    
    -- Get member IDs associated with this user (via phone number)
    -- Delete member guarantors
    DELETE FROM public.member_guarantors 
    WHERE member_id IN (
        SELECT id FROM public.members 
        WHERE phone IN (
            SELECT mobile_number FROM public.kyc_applications 
            WHERE user_id = target_user_id
        )
    );
    RAISE NOTICE 'Deleted member_guarantors';

    -- Delete member financial info
    DELETE FROM public.member_financial_info 
    WHERE member_id IN (
        SELECT id FROM public.members 
        WHERE phone IN (
            SELECT mobile_number FROM public.kyc_applications 
            WHERE user_id = target_user_id
        )
    );
    RAISE NOTICE 'Deleted member_financial_info';

    -- Delete member businesses
    DELETE FROM public.member_businesses 
    WHERE member_id IN (
        SELECT id FROM public.members 
        WHERE phone IN (
            SELECT mobile_number FROM public.kyc_applications 
            WHERE user_id = target_user_id
        )
    );
    RAISE NOTICE 'Deleted member_businesses';

    -- Delete member identifications
    DELETE FROM public.member_identifications 
    WHERE member_id IN (
        SELECT id FROM public.members 
        WHERE phone IN (
            SELECT mobile_number FROM public.kyc_applications 
            WHERE user_id = target_user_id
        )
    );
    RAISE NOTICE 'Deleted member_identifications';

    -- Delete member addresses
    DELETE FROM public.member_addresses 
    WHERE member_id IN (
        SELECT id FROM public.members 
        WHERE phone IN (
            SELECT mobile_number FROM public.kyc_applications 
            WHERE user_id = target_user_id
        )
    );
    RAISE NOTICE 'Deleted member_addresses';

    -- Delete member profiles
    DELETE FROM public.member_profiles 
    WHERE member_id IN (
        SELECT id FROM public.members 
        WHERE phone IN (
            SELECT mobile_number FROM public.kyc_applications 
            WHERE user_id = target_user_id
        )
    );
    RAISE NOTICE 'Deleted member_profiles';

    -- Delete member documents
    DELETE FROM public.member_documents 
    WHERE member_id IN (
        SELECT id FROM public.members 
        WHERE phone IN (
            SELECT mobile_number FROM public.kyc_applications 
            WHERE user_id = target_user_id
        )
    );
    RAISE NOTICE 'Deleted member_documents';

    -- Delete members
    DELETE FROM public.members 
    WHERE phone IN (
        SELECT mobile_number FROM public.kyc_applications 
        WHERE user_id = target_user_id
    );
    RAISE NOTICE 'Deleted members';

    -- ========================================================================
    -- 3. DELETE FROM APPROVAL-RELATED TABLES
    -- ========================================================================
    
    -- Get KYC application IDs for this user
    -- Delete application notes
    DELETE FROM public.application_notes 
    WHERE application_id IN (
        SELECT id FROM public.kyc_applications 
        WHERE user_id = target_user_id
    );
    RAISE NOTICE 'Deleted application_notes';

    -- Delete audit trail
    DELETE FROM public.approval_audit_trail 
    WHERE application_id IN (
        SELECT id FROM public.kyc_applications 
        WHERE user_id = target_user_id
    );
    RAISE NOTICE 'Deleted approval_audit_trail';

    -- ========================================================================
    -- 4. DELETE FROM PROFILES TABLE
    -- ========================================================================
    
    DELETE FROM public.profiles 
    WHERE id = target_user_id;
    RAISE NOTICE 'Deleted profiles';

    -- ========================================================================
    -- 5. DELETE FROM AUTH.USERS (AUTHENTICATION)
    -- ========================================================================
    -- Note: This requires service role or admin privileges
    -- If you get permission error, delete this manually from Supabase Dashboard
    
    DELETE FROM auth.users 
    WHERE id = target_user_id;
    RAISE NOTICE 'Deleted auth.users';

    RAISE NOTICE '✓ All data deleted successfully for user: %', target_user_id;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error occurred: %', SQLERRM;
        RAISE;
END $$;

-- ============================================================================
-- 6. DELETE STORAGE FILES (Run separately if needed)
-- ============================================================================
-- Note: Storage files need to be deleted via Supabase Dashboard or API
-- Go to: Storage > member-documents > kyc/078fa78b-4d48-420f-b386-46813d1adf52
-- Delete the entire folder manually

-- ============================================================================
-- VERIFICATION QUERIES (Run after deletion to verify)
-- ============================================================================

-- Check if user still exists in any table
SELECT 'kyc_applications' as table_name, COUNT(*) as count 
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

-- All counts should be 0

-- ============================================================================
-- END OF SCRIPT
-- ============================================================================
