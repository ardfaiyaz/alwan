-- =====================================================
-- DIAGNOSTIC QUERIES FOR ALWAN DATABASE
-- Run these to check the current state of your database
-- =====================================================

-- 1. Check if RLS is enabled on tables
SELECT 
    tablename, 
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- 2. List all RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd as command,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 3. Check profiles table
SELECT 
    id,
    email,
    full_name,
    role,
    area_id,
    branch_id,
    is_active,
    created_at
FROM public.profiles
ORDER BY created_at DESC;

-- 4. Count profiles by role
SELECT 
    role,
    COUNT(*) as count,
    COUNT(*) FILTER (WHERE is_active = true) as active_count,
    COUNT(*) FILTER (WHERE is_active = false) as inactive_count
FROM public.profiles
GROUP BY role
ORDER BY role;

-- 5. Check permissions by role
SELECT 
    role,
    COUNT(*) as permission_count,
    array_agg(DISTINCT resource) as resources,
    array_agg(DISTINCT action) as actions
FROM public.permissions
GROUP BY role
ORDER BY role;

-- 6. List all permissions for admin role
SELECT 
    resource,
    action
FROM public.permissions
WHERE role = 'admin'
ORDER BY resource, action;

-- 7. Check areas and branches
SELECT 
    a.name as area_name,
    a.code as area_code,
    COUNT(b.id) as branch_count,
    array_agg(b.name) as branches
FROM public.areas a
LEFT JOIN public.branches b ON b.area_id = a.id
WHERE a.is_active = true
GROUP BY a.id, a.name, a.code
ORDER BY a.name;

-- 8. Check for orphaned auth users (users without profiles)
SELECT 
    u.id,
    u.email,
    u.created_at,
    u.email_confirmed_at,
    CASE WHEN p.id IS NULL THEN 'NO PROFILE' ELSE 'HAS PROFILE' END as profile_status
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
ORDER BY u.created_at DESC;

-- 9. Check recent audit logs
SELECT 
    user_email,
    user_role,
    action,
    resource_type,
    success,
    created_at
FROM public.audit_logs
ORDER BY created_at DESC
LIMIT 20;

-- 10. Check if helper functions exist
SELECT 
    routine_name,
    routine_type,
    data_type as return_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('get_user_role', 'is_admin', 'handle_new_user')
ORDER BY routine_name;

-- 11. Check triggers
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
OR event_object_schema = 'auth'
ORDER BY event_object_table, trigger_name;

-- 12. Test current user's role (run this when logged in)
SELECT 
    auth.uid() as current_user_id,
    p.email,
    p.full_name,
    p.role,
    p.is_active
FROM public.profiles p
WHERE p.id = auth.uid();

-- 13. Check for duplicate emails
SELECT 
    email,
    COUNT(*) as count
FROM public.profiles
GROUP BY email
HAVING COUNT(*) > 1;

-- 14. Check global settings
SELECT 
    key,
    value,
    description,
    updated_at
FROM public.global_settings
ORDER BY key;

-- 15. Summary statistics
SELECT 
    'Total Profiles' as metric,
    COUNT(*)::text as value
FROM public.profiles
UNION ALL
SELECT 
    'Active Profiles',
    COUNT(*)::text
FROM public.profiles
WHERE is_active = true
UNION ALL
SELECT 
    'Total Areas',
    COUNT(*)::text
FROM public.areas
UNION ALL
SELECT 
    'Total Branches',
    COUNT(*)::text
FROM public.branches
UNION ALL
SELECT 
    'Total Centers',
    COUNT(*)::text
FROM public.centers
UNION ALL
SELECT 
    'Total Members',
    COUNT(*)::text
FROM public.members
UNION ALL
SELECT 
    'Total Loans',
    COUNT(*)::text
FROM public.loans
UNION ALL
SELECT 
    'Total Permissions',
    COUNT(*)::text
FROM public.permissions;
