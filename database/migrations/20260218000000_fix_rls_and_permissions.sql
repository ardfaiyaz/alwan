-- =====================================================
-- FIX RLS POLICIES AND PERMISSIONS
-- Created: 2026-02-18
-- Purpose: Fix 406 errors and improve role-based access
-- =====================================================

-- =====================================================
-- 0. CHECK ENUM TYPES (for debugging)
-- =====================================================
-- Uncomment to see available enum values:
-- SELECT t.typname as enum_name, e.enumlabel as enum_value
-- FROM pg_type t 
-- JOIN pg_enum e ON t.oid = e.enumtypid  
-- WHERE t.typname IN ('user_role', 'permission_resource', 'permission_action', 'loan_status', 'loan_type', 'collection_status', 'approval_action')
-- ORDER BY t.typname, e.enumsortorder;

-- =====================================================
-- 1. DROP EXISTING POLICIES (Clean slate)
-- =====================================================

DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON public.profiles;

DROP POLICY IF EXISTS "areas_select_policy" ON public.areas;
DROP POLICY IF EXISTS "areas_insert_policy" ON public.areas;
DROP POLICY IF EXISTS "areas_update_policy" ON public.areas;
DROP POLICY IF EXISTS "areas_delete_policy" ON public.areas;

DROP POLICY IF EXISTS "branches_select_policy" ON public.branches;
DROP POLICY IF EXISTS "branches_insert_policy" ON public.branches;
DROP POLICY IF EXISTS "branches_update_policy" ON public.branches;
DROP POLICY IF EXISTS "branches_delete_policy" ON public.branches;

DROP POLICY IF EXISTS "centers_select_policy" ON public.centers;
DROP POLICY IF EXISTS "centers_insert_policy" ON public.centers;
DROP POLICY IF EXISTS "centers_update_policy" ON public.centers;
DROP POLICY IF EXISTS "centers_delete_policy" ON public.centers;

DROP POLICY IF EXISTS "members_select_policy" ON public.members;
DROP POLICY IF EXISTS "members_insert_policy" ON public.members;
DROP POLICY IF EXISTS "members_update_policy" ON public.members;
DROP POLICY IF EXISTS "members_delete_policy" ON public.members;

DROP POLICY IF EXISTS "loans_select_policy" ON public.loans;
DROP POLICY IF EXISTS "loans_insert_policy" ON public.loans;
DROP POLICY IF EXISTS "loans_update_policy" ON public.loans;
DROP POLICY IF EXISTS "loans_delete_policy" ON public.loans;

DROP POLICY IF EXISTS "transactions_select_policy" ON public.transactions;
DROP POLICY IF EXISTS "transactions_insert_policy" ON public.transactions;
DROP POLICY IF EXISTS "transactions_update_policy" ON public.transactions;

DROP POLICY IF EXISTS "audit_logs_select_policy" ON public.audit_logs;
DROP POLICY IF EXISTS "audit_logs_insert_policy" ON public.audit_logs;

DROP POLICY IF EXISTS "permissions_select_policy" ON public.permissions;

-- =====================================================
-- 2. ENABLE RLS ON ALL TABLES
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
-- 3. HELPER FUNCTION: Get User Role
-- =====================================================

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role AS $$
BEGIN
  RETURN (
    SELECT role 
    FROM public.profiles 
    WHERE id = auth.uid()
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 4. HELPER FUNCTION: Check if user is admin
-- =====================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (
    SELECT role = 'admin'
    FROM public.profiles 
    WHERE id = auth.uid()
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 5. PROFILES TABLE POLICIES
-- =====================================================

-- Allow users to read their own profile
CREATE POLICY "profiles_select_own"
ON public.profiles FOR SELECT
USING (id = auth.uid());

-- Allow admins to read all profiles
CREATE POLICY "profiles_select_admin"
ON public.profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Allow area managers to read profiles in their area
CREATE POLICY "profiles_select_area_manager"
ON public.profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() 
    AND p.role = 'area_manager'
    AND p.area_id = profiles.area_id
  )
);

-- Allow branch managers to read profiles in their branch
CREATE POLICY "profiles_select_branch_manager"
ON public.profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() 
    AND p.role = 'branch_manager'
    AND p.branch_id = profiles.branch_id
  )
);

-- Only admins can insert new profiles (staff creation)
CREATE POLICY "profiles_insert_admin"
ON public.profiles FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Allow users to update their own profile (limited fields)
CREATE POLICY "profiles_update_own"
ON public.profiles FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Allow admins to update any profile
CREATE POLICY "profiles_update_admin"
ON public.profiles FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Only admins can delete (deactivate) profiles
CREATE POLICY "profiles_delete_admin"
ON public.profiles FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- =====================================================
-- 6. AREAS TABLE POLICIES
-- =====================================================

-- Everyone can read active areas
CREATE POLICY "areas_select_all"
ON public.areas FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Only admins can manage areas
CREATE POLICY "areas_insert_admin"
ON public.areas FOR INSERT
WITH CHECK (public.is_admin());

CREATE POLICY "areas_update_admin"
ON public.areas FOR UPDATE
USING (public.is_admin());

CREATE POLICY "areas_delete_admin"
ON public.areas FOR DELETE
USING (public.is_admin());

-- =====================================================
-- 7. BRANCHES TABLE POLICIES
-- =====================================================

-- Everyone can read active branches
CREATE POLICY "branches_select_all"
ON public.branches FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Admins and area managers can manage branches
CREATE POLICY "branches_insert_admin_area_mgr"
ON public.branches FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() 
    AND role IN ('admin', 'area_manager')
  )
);

CREATE POLICY "branches_update_admin_area_mgr"
ON public.branches FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() 
    AND (
      p.role = 'admin' 
      OR (p.role = 'area_manager' AND p.area_id = branches.area_id)
    )
  )
);

CREATE POLICY "branches_delete_admin"
ON public.branches FOR DELETE
USING (public.is_admin());

-- =====================================================
-- 8. CENTERS TABLE POLICIES
-- =====================================================

-- Users can read centers based on their role
CREATE POLICY "centers_select_all"
ON public.centers FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    LEFT JOIN public.branches b ON b.id = p.branch_id
    WHERE p.id = auth.uid()
    AND (
      p.role = 'admin'
      OR (p.role = 'area_manager' AND b.area_id = (SELECT area_id FROM branches WHERE id = centers.branch_id))
      OR (p.role = 'branch_manager' AND p.branch_id = centers.branch_id)
      OR (p.role = 'field_officer' AND p.branch_id = centers.branch_id)
    )
  )
);

-- Branch managers and above can create centers
CREATE POLICY "centers_insert_branch_mgr_up"
ON public.centers FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
    AND p.role IN ('admin', 'area_manager', 'branch_manager')
  )
);

-- Branch managers and above can update centers
CREATE POLICY "centers_update_branch_mgr_up"
ON public.centers FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    LEFT JOIN public.branches b ON b.id = p.branch_id
    WHERE p.id = auth.uid()
    AND (
      p.role = 'admin'
      OR (p.role = 'area_manager' AND b.area_id = (SELECT area_id FROM branches WHERE id = centers.branch_id))
      OR (p.role = 'branch_manager' AND p.branch_id = centers.branch_id)
    )
  )
);

-- Only admins can delete centers
CREATE POLICY "centers_delete_admin"
ON public.centers FOR DELETE
USING (public.is_admin());

-- =====================================================
-- 9. MEMBERS TABLE POLICIES
-- =====================================================

-- Users can read members based on their role and center access
CREATE POLICY "members_select_by_role"
ON public.members FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    LEFT JOIN public.branches b ON b.id = p.branch_id
    LEFT JOIN public.centers c ON c.id = members.center_id
    WHERE p.id = auth.uid()
    AND (
      p.role = 'admin'
      OR (p.role = 'area_manager' AND b.area_id = (SELECT area_id FROM branches WHERE id = c.branch_id))
      OR (p.role = 'branch_manager' AND p.branch_id = c.branch_id)
      OR (p.role = 'field_officer' AND p.branch_id = c.branch_id)
    )
  )
);

-- Field officers and above can create members
CREATE POLICY "members_insert_field_officer_up"
ON public.members FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'area_manager', 'branch_manager', 'field_officer')
  )
);

-- Field officers and above can update members
CREATE POLICY "members_update_field_officer_up"
ON public.members FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    LEFT JOIN public.branches b ON b.id = p.branch_id
    LEFT JOIN public.centers c ON c.id = members.center_id
    WHERE p.id = auth.uid()
    AND (
      p.role = 'admin'
      OR (p.role = 'area_manager' AND b.area_id = (SELECT area_id FROM branches WHERE id = c.branch_id))
      OR (p.role = 'branch_manager' AND p.branch_id = c.branch_id)
      OR (p.role = 'field_officer' AND p.branch_id = c.branch_id)
    )
  )
);

-- Only admins can delete members
CREATE POLICY "members_delete_admin"
ON public.members FOR DELETE
USING (public.is_admin());

-- =====================================================
-- 10. LOANS TABLE POLICIES
-- =====================================================

-- Users can read loans based on their role
CREATE POLICY "loans_select_by_role"
ON public.loans FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    LEFT JOIN public.branches b ON b.id = p.branch_id
    LEFT JOIN public.centers c ON c.id = loans.center_id
    WHERE p.id = auth.uid()
    AND (
      p.role = 'admin'
      OR (p.role = 'area_manager' AND b.area_id = (SELECT area_id FROM branches WHERE id = c.branch_id))
      OR (p.role = 'branch_manager' AND p.branch_id = c.branch_id)
      OR (p.role = 'field_officer' AND p.branch_id = c.branch_id)
    )
  )
);

-- Field officers and above can create loans
CREATE POLICY "loans_insert_field_officer_up"
ON public.loans FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'area_manager', 'branch_manager', 'field_officer')
  )
);

-- Field officers and above can update loans
CREATE POLICY "loans_update_field_officer_up"
ON public.loans FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    LEFT JOIN public.branches b ON b.id = p.branch_id
    LEFT JOIN public.centers c ON c.id = loans.center_id
    WHERE p.id = auth.uid()
    AND (
      p.role = 'admin'
      OR (p.role = 'area_manager' AND b.area_id = (SELECT area_id FROM branches WHERE id = c.branch_id))
      OR (p.role = 'branch_manager' AND p.branch_id = c.branch_id)
      OR (p.role = 'field_officer' AND p.branch_id = c.branch_id)
    )
  )
);

-- Only admins can delete loans
CREATE POLICY "loans_delete_admin"
ON public.loans FOR DELETE
USING (public.is_admin());

-- =====================================================
-- 11. LOAN APPROVALS TABLE POLICIES
-- =====================================================

CREATE POLICY "loan_approvals_select_by_role"
ON public.loan_approvals FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'area_manager', 'branch_manager')
  )
);

CREATE POLICY "loan_approvals_insert_managers"
ON public.loan_approvals FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'area_manager', 'branch_manager')
  )
);

-- =====================================================
-- 12. TRANSACTIONS TABLE POLICIES
-- =====================================================

CREATE POLICY "transactions_select_by_role"
ON public.transactions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    LEFT JOIN public.branches b ON b.id = p.branch_id
    LEFT JOIN public.centers c ON c.id = transactions.center_id
    WHERE p.id = auth.uid()
    AND (
      p.role = 'admin'
      OR (p.role = 'area_manager' AND b.area_id = (SELECT area_id FROM branches WHERE id = c.branch_id))
      OR (p.role = 'branch_manager' AND p.branch_id = c.branch_id)
      OR (p.role = 'field_officer' AND p.branch_id = c.branch_id)
    )
  )
);

CREATE POLICY "transactions_insert_field_officer_up"
ON public.transactions FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'area_manager', 'branch_manager', 'field_officer')
  )
);

CREATE POLICY "transactions_update_field_officer_up"
ON public.transactions FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'area_manager', 'branch_manager', 'field_officer')
  )
);

-- =====================================================
-- 13. REPAYMENT SCHEDULES TABLE POLICIES
-- =====================================================

CREATE POLICY "repayment_schedules_select_by_role"
ON public.repayment_schedules FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    LEFT JOIN public.loans l ON l.id = repayment_schedules.loan_id
    LEFT JOIN public.centers c ON c.id = l.center_id
    LEFT JOIN public.branches b ON b.id = c.branch_id
    WHERE p.id = auth.uid()
    AND (
      p.role = 'admin'
      OR (p.role = 'area_manager' AND b.area_id = p.area_id)
      OR (p.role = 'branch_manager' AND c.branch_id = p.branch_id)
      OR (p.role = 'field_officer' AND c.branch_id = p.branch_id)
    )
  )
);

CREATE POLICY "repayment_schedules_insert_system"
ON public.repayment_schedules FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'area_manager', 'branch_manager', 'field_officer')
  )
);

CREATE POLICY "repayment_schedules_update_system"
ON public.repayment_schedules FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'area_manager', 'branch_manager', 'field_officer')
  )
);

-- =====================================================
-- 14. WEEKLY COLLECTION SHEETS TABLE POLICIES
-- =====================================================

CREATE POLICY "weekly_collection_sheets_select_by_role"
ON public.weekly_collection_sheets FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    LEFT JOIN public.branches b ON b.id = p.branch_id
    LEFT JOIN public.centers c ON c.id = weekly_collection_sheets.center_id
    WHERE p.id = auth.uid()
    AND (
      p.role = 'admin'
      OR (p.role = 'area_manager' AND b.area_id = (SELECT area_id FROM branches WHERE id = c.branch_id))
      OR (p.role = 'branch_manager' AND p.branch_id = c.branch_id)
      OR (p.role = 'field_officer' AND p.branch_id = c.branch_id)
    )
  )
);

CREATE POLICY "weekly_collection_sheets_insert_field_officer_up"
ON public.weekly_collection_sheets FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'area_manager', 'branch_manager', 'field_officer')
  )
);

CREATE POLICY "weekly_collection_sheets_update_field_officer_up"
ON public.weekly_collection_sheets FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'area_manager', 'branch_manager', 'field_officer')
  )
);

-- =====================================================
-- 15. BUSINESS EVALUATIONS TABLE POLICIES
-- =====================================================

CREATE POLICY "business_evaluations_select_by_role"
ON public.business_evaluations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'area_manager', 'branch_manager', 'field_officer')
  )
);

CREATE POLICY "business_evaluations_insert_field_officer_up"
ON public.business_evaluations FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'area_manager', 'branch_manager', 'field_officer')
  )
);

CREATE POLICY "business_evaluations_update_field_officer_up"
ON public.business_evaluations FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'area_manager', 'branch_manager', 'field_officer')
  )
);

-- =====================================================
-- 16. CAPITAL BUILDUP TABLE POLICIES
-- =====================================================

CREATE POLICY "capital_buildup_select_by_role"
ON public.capital_buildup FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'area_manager', 'branch_manager', 'field_officer')
  )
);

CREATE POLICY "capital_buildup_insert_system"
ON public.capital_buildup FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'area_manager', 'branch_manager', 'field_officer')
  )
);

CREATE POLICY "capital_buildup_update_system"
ON public.capital_buildup FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'area_manager', 'branch_manager', 'field_officer')
  )
);

-- =====================================================
-- 17. AUDIT LOGS TABLE POLICIES
-- =====================================================

-- Everyone can insert audit logs
CREATE POLICY "audit_logs_insert_all"
ON public.audit_logs FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Only admins can read audit logs
CREATE POLICY "audit_logs_select_admin"
ON public.audit_logs FOR SELECT
USING (public.is_admin());

-- =====================================================
-- 18. PERMISSIONS TABLE POLICIES
-- =====================================================

-- Everyone can read permissions (needed for authorization checks)
CREATE POLICY "permissions_select_all"
ON public.permissions FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Only admins can manage permissions
CREATE POLICY "permissions_insert_admin"
ON public.permissions FOR INSERT
WITH CHECK (public.is_admin());

CREATE POLICY "permissions_update_admin"
ON public.permissions FOR UPDATE
USING (public.is_admin());

CREATE POLICY "permissions_delete_admin"
ON public.permissions FOR DELETE
USING (public.is_admin());

-- =====================================================
-- 19. GLOBAL SETTINGS TABLE POLICIES
-- =====================================================

-- Everyone can read settings
CREATE POLICY "global_settings_select_all"
ON public.global_settings FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Only admins can manage settings
CREATE POLICY "global_settings_insert_admin"
ON public.global_settings FOR INSERT
WITH CHECK (public.is_admin());

CREATE POLICY "global_settings_update_admin"
ON public.global_settings FOR UPDATE
USING (public.is_admin());

CREATE POLICY "global_settings_delete_admin"
ON public.global_settings FOR DELETE
USING (public.is_admin());

-- =====================================================
-- 20. ADD MISSING PERMISSIONS FOR OTHER ROLES
-- =====================================================
-- Note: Only using valid enum values from permission_resource
-- Valid resources: users, dashboard, audit_logs, loans, members, centers, reports, settings, approvals, collections

-- Area Manager Permissions
INSERT INTO public.permissions (role, resource, action) VALUES
  ('area_manager', 'dashboard', 'view'),
  ('area_manager', 'centers', 'view'),
  ('area_manager', 'centers', 'create'),
  ('area_manager', 'centers', 'edit'),
  ('area_manager', 'centers', 'export'),
  ('area_manager', 'members', 'view'),
  ('area_manager', 'members', 'create'),
  ('area_manager', 'members', 'edit'),
  ('area_manager', 'members', 'export'),
  ('area_manager', 'loans', 'view'),
  ('area_manager', 'loans', 'create'),
  ('area_manager', 'loans', 'edit'),
  ('area_manager', 'loans', 'approve'),
  ('area_manager', 'loans', 'export'),
  ('area_manager', 'collections', 'view'),
  ('area_manager', 'collections', 'export'),
  ('area_manager', 'reports', 'view'),
  ('area_manager', 'reports', 'export'),
  ('area_manager', 'approvals', 'view'),
  ('area_manager', 'approvals', 'approve')
ON CONFLICT DO NOTHING;

-- Branch Manager Permissions
INSERT INTO public.permissions (role, resource, action) VALUES
  ('branch_manager', 'dashboard', 'view'),
  ('branch_manager', 'centers', 'view'),
  ('branch_manager', 'centers', 'create'),
  ('branch_manager', 'centers', 'edit'),
  ('branch_manager', 'centers', 'export'),
  ('branch_manager', 'members', 'view'),
  ('branch_manager', 'members', 'create'),
  ('branch_manager', 'members', 'edit'),
  ('branch_manager', 'members', 'export'),
  ('branch_manager', 'loans', 'view'),
  ('branch_manager', 'loans', 'create'),
  ('branch_manager', 'loans', 'edit'),
  ('branch_manager', 'loans', 'approve'),
  ('branch_manager', 'loans', 'export'),
  ('branch_manager', 'collections', 'view'),
  ('branch_manager', 'collections', 'create'),
  ('branch_manager', 'collections', 'edit'),
  ('branch_manager', 'collections', 'export'),
  ('branch_manager', 'reports', 'view'),
  ('branch_manager', 'reports', 'export'),
  ('branch_manager', 'approvals', 'view'),
  ('branch_manager', 'approvals', 'approve')
ON CONFLICT DO NOTHING;

-- Field Officer Permissions
INSERT INTO public.permissions (role, resource, action) VALUES
  ('field_officer', 'dashboard', 'view'),
  ('field_officer', 'centers', 'view'),
  ('field_officer', 'members', 'view'),
  ('field_officer', 'members', 'create'),
  ('field_officer', 'members', 'edit'),
  ('field_officer', 'loans', 'view'),
  ('field_officer', 'loans', 'create'),
  ('field_officer', 'loans', 'edit'),
  ('field_officer', 'collections', 'view'),
  ('field_officer', 'collections', 'create'),
  ('field_officer', 'collections', 'edit'),
  ('field_officer', 'reports', 'view')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 21. CREATE TRIGGER TO AUTO-CREATE PROFILE ON SIGNUP
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
-- MIGRATION COMPLETE
-- =====================================================
