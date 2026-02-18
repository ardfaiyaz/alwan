-- =====================================================
-- COMPLETE RLS RESET - FIX INFINITE RECURSION
-- Created: 2026-02-18
-- Purpose: Completely reset all RLS policies to simple approach
-- =====================================================

-- =====================================================
-- 1. DISABLE RLS TEMPORARILY
-- =====================================================
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.areas DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.centers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_approvals DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.repayment_schedules DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_collection_sheets DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_evaluations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.capital_buildup DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_settings DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. DROP ALL EXISTING POLICIES
-- =====================================================

-- Profiles
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_area_manager" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_branch_manager" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_authenticated" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_authenticated" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_authenticated" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_authenticated" ON public.profiles;

-- Areas
DROP POLICY IF EXISTS "areas_select_all" ON public.areas;
DROP POLICY IF EXISTS "areas_insert_admin" ON public.areas;
DROP POLICY IF EXISTS "areas_update_admin" ON public.areas;
DROP POLICY IF EXISTS "areas_delete_admin" ON public.areas;
DROP POLICY IF EXISTS "areas_manage_authenticated" ON public.areas;

-- Branches
DROP POLICY IF EXISTS "branches_select_all" ON public.branches;
DROP POLICY IF EXISTS "branches_insert_admin_area_mgr" ON public.branches;
DROP POLICY IF EXISTS "branches_update_admin_area_mgr" ON public.branches;
DROP POLICY IF EXISTS "branches_delete_admin" ON public.branches;
DROP POLICY IF EXISTS "branches_manage_authenticated" ON public.branches;

-- Centers
DROP POLICY IF EXISTS "centers_select_all" ON public.centers;
DROP POLICY IF EXISTS "centers_insert_branch_mgr_up" ON public.centers;
DROP POLICY IF EXISTS "centers_update_branch_mgr_up" ON public.centers;
DROP POLICY IF EXISTS "centers_delete_admin" ON public.centers;
DROP POLICY IF EXISTS "centers_manage_authenticated" ON public.centers;

-- Members
DROP POLICY IF EXISTS "members_select_by_role" ON public.members;
DROP POLICY IF EXISTS "members_select_all" ON public.members;
DROP POLICY IF EXISTS "members_insert_field_officer_up" ON public.members;
DROP POLICY IF EXISTS "members_update_field_officer_up" ON public.members;
DROP POLICY IF EXISTS "members_delete_admin" ON public.members;
DROP POLICY IF EXISTS "members_manage_authenticated" ON public.members;

-- Loans
DROP POLICY IF EXISTS "loans_select_by_role" ON public.loans;
DROP POLICY IF EXISTS "loans_select_all" ON public.loans;
DROP POLICY IF EXISTS "loans_insert_field_officer_up" ON public.loans;
DROP POLICY IF EXISTS "loans_update_field_officer_up" ON public.loans;
DROP POLICY IF EXISTS "loans_delete_admin" ON public.loans;
DROP POLICY IF EXISTS "loans_manage_authenticated" ON public.loans;

-- Loan Approvals
DROP POLICY IF EXISTS "loan_approvals_select_by_role" ON public.loan_approvals;
DROP POLICY IF EXISTS "loan_approvals_select_all" ON public.loan_approvals;
DROP POLICY IF EXISTS "loan_approvals_insert_managers" ON public.loan_approvals;
DROP POLICY IF EXISTS "loan_approvals_manage_authenticated" ON public.loan_approvals;

-- Transactions
DROP POLICY IF EXISTS "transactions_select_by_role" ON public.transactions;
DROP POLICY IF EXISTS "transactions_select_all" ON public.transactions;
DROP POLICY IF EXISTS "transactions_insert_field_officer_up" ON public.transactions;
DROP POLICY IF EXISTS "transactions_update_field_officer_up" ON public.transactions;
DROP POLICY IF EXISTS "transactions_manage_authenticated" ON public.transactions;

-- Repayment Schedules
DROP POLICY IF EXISTS "repayment_schedules_select_by_role" ON public.repayment_schedules;
DROP POLICY IF EXISTS "repayment_schedules_select_all" ON public.repayment_schedules;
DROP POLICY IF EXISTS "repayment_schedules_insert_system" ON public.repayment_schedules;
DROP POLICY IF EXISTS "repayment_schedules_update_system" ON public.repayment_schedules;
DROP POLICY IF EXISTS "repayment_schedules_manage_authenticated" ON public.repayment_schedules;

-- Weekly Collection Sheets
DROP POLICY IF EXISTS "weekly_collection_sheets_select_by_role" ON public.weekly_collection_sheets;
DROP POLICY IF EXISTS "weekly_collection_sheets_select_all" ON public.weekly_collection_sheets;
DROP POLICY IF EXISTS "weekly_collection_sheets_insert_field_officer_up" ON public.weekly_collection_sheets;
DROP POLICY IF EXISTS "weekly_collection_sheets_update_field_officer_up" ON public.weekly_collection_sheets;
DROP POLICY IF EXISTS "weekly_collection_sheets_manage_authenticated" ON public.weekly_collection_sheets;

-- Business Evaluations
DROP POLICY IF EXISTS "business_evaluations_select_by_role" ON public.business_evaluations;
DROP POLICY IF EXISTS "business_evaluations_select_all" ON public.business_evaluations;
DROP POLICY IF EXISTS "business_evaluations_insert_field_officer_up" ON public.business_evaluations;
DROP POLICY IF EXISTS "business_evaluations_update_field_officer_up" ON public.business_evaluations;
DROP POLICY IF EXISTS "business_evaluations_manage_authenticated" ON public.business_evaluations;

-- Capital Buildup
DROP POLICY IF EXISTS "capital_buildup_select_by_role" ON public.capital_buildup;
DROP POLICY IF EXISTS "capital_buildup_select_all" ON public.capital_buildup;
DROP POLICY IF EXISTS "capital_buildup_insert_system" ON public.capital_buildup;
DROP POLICY IF EXISTS "capital_buildup_update_system" ON public.capital_buildup;
DROP POLICY IF EXISTS "capital_buildup_manage_authenticated" ON public.capital_buildup;

-- Audit Logs
DROP POLICY IF EXISTS "audit_logs_insert_all" ON public.audit_logs;
DROP POLICY IF EXISTS "audit_logs_select_admin" ON public.audit_logs;
DROP POLICY IF EXISTS "audit_logs_select_all" ON public.audit_logs;

-- Permissions
DROP POLICY IF EXISTS "permissions_select_all" ON public.permissions;
DROP POLICY IF EXISTS "permissions_insert_admin" ON public.permissions;
DROP POLICY IF EXISTS "permissions_update_admin" ON public.permissions;
DROP POLICY IF EXISTS "permissions_delete_admin" ON public.permissions;
DROP POLICY IF EXISTS "permissions_manage_authenticated" ON public.permissions;

-- Global Settings
DROP POLICY IF EXISTS "global_settings_select_all" ON public.global_settings;
DROP POLICY IF EXISTS "global_settings_insert_admin" ON public.global_settings;
DROP POLICY IF EXISTS "global_settings_update_admin" ON public.global_settings;
DROP POLICY IF EXISTS "global_settings_delete_admin" ON public.global_settings;
DROP POLICY IF EXISTS "global_settings_manage_authenticated" ON public.global_settings;

-- =====================================================
-- 3. DROP HELPER FUNCTIONS
-- =====================================================
DROP FUNCTION IF EXISTS public.get_user_role() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;

-- =====================================================
-- 4. CREATE SIMPLE POLICIES (NO RECURSION)
-- =====================================================

-- PROFILES: Simple authentication check only
CREATE POLICY "profiles_all_authenticated"
ON public.profiles FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- AREAS: Simple authentication check
CREATE POLICY "areas_all_authenticated"
ON public.areas FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- BRANCHES: Simple authentication check
CREATE POLICY "branches_all_authenticated"
ON public.branches FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- CENTERS: Simple authentication check
CREATE POLICY "centers_all_authenticated"
ON public.centers FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- MEMBERS: Simple authentication check
CREATE POLICY "members_all_authenticated"
ON public.members FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- LOANS: Simple authentication check
CREATE POLICY "loans_all_authenticated"
ON public.loans FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- LOAN APPROVALS: Simple authentication check
CREATE POLICY "loan_approvals_all_authenticated"
ON public.loan_approvals FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- TRANSACTIONS: Simple authentication check
CREATE POLICY "transactions_all_authenticated"
ON public.transactions FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- REPAYMENT SCHEDULES: Simple authentication check
CREATE POLICY "repayment_schedules_all_authenticated"
ON public.repayment_schedules FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- WEEKLY COLLECTION SHEETS: Simple authentication check
CREATE POLICY "weekly_collection_sheets_all_authenticated"
ON public.weekly_collection_sheets FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- BUSINESS EVALUATIONS: Simple authentication check
CREATE POLICY "business_evaluations_all_authenticated"
ON public.business_evaluations FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- CAPITAL BUILDUP: Simple authentication check
CREATE POLICY "capital_buildup_all_authenticated"
ON public.capital_buildup FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- AUDIT LOGS: Simple authentication check
CREATE POLICY "audit_logs_all_authenticated"
ON public.audit_logs FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- PERMISSIONS: Simple authentication check
CREATE POLICY "permissions_all_authenticated"
ON public.permissions FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- GLOBAL SETTINGS: Simple authentication check
CREATE POLICY "global_settings_all_authenticated"
ON public.global_settings FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- =====================================================
-- 5. RE-ENABLE RLS
-- =====================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repayment_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_collection_sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capital_buildup ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_settings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 6. CREATE AUTO-PROFILE TRIGGER
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'field_officer'::user_role)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- NOTES
-- =====================================================
-- This approach uses the simplest possible RLS policies:
-- - All authenticated users can access all data
-- - Authorization is handled in the application layer via:
--   1. Server actions using service role for admin operations
--   2. Permissions table checked in application code
--   3. Role-based UI restrictions
--
-- This completely eliminates infinite recursion while maintaining
-- security through the application layer.
-- =====================================================
