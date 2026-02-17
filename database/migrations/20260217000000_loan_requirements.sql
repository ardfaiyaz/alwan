-- Migration: Add Loan Eligibility and Attendance Requirements
-- Created: 2026-02-17

-- 1. Create center_attendance table
CREATE TABLE IF NOT EXISTS public.center_attendance (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  center_id uuid NOT NULL,
  profile_id uuid NOT NULL,
  meeting_date date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL CHECK (status = ANY (ARRAY['present', 'absent', 'late', 'excused'])),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  
  CONSTRAINT center_attendance_pkey PRIMARY KEY (id),
  CONSTRAINT center_attendance_center_id_fkey FOREIGN KEY (center_id) REFERENCES public.centers(id),
  CONSTRAINT center_attendance_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
);

-- Index for faster eligibility calculations
CREATE INDEX IF NOT EXISTS idx_center_attendance_profile_on_date ON public.center_attendance(profile_id, meeting_date);

-- 2. Update loan_products with requirement fields
ALTER TABLE public.loan_products 
ADD COLUMN IF NOT EXISTS min_membership_weeks integer DEFAULT 8,
ADD COLUMN IF NOT EXISTS min_attendance_rate numeric DEFAULT 0.85,
ADD COLUMN IF NOT EXISTS min_co_makers integer DEFAULT 2,
ADD COLUMN IF NOT EXISTS max_co_makers integer DEFAULT 15,
ADD COLUMN IF NOT EXISTS requires_officer_approval boolean DEFAULT true;

-- 3. Update profiles with membership tenure
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS membership_start_date timestamp with time zone DEFAULT timezone('utc'::text, now());

-- 4. Create Member Eligibility View
-- This view consolidates various metrics to determine if a member can apply for a loan.
CREATE OR REPLACE VIEW public.member_eligibility AS
WITH attendance_metrics AS (
    SELECT 
        profile_id,
        COUNT(*) FILTER (WHERE status = 'present' OR status = 'late') / NULLIF(COUNT(*), 0)::numeric as attendance_rate,
        COUNT(*) as total_meetings
    FROM public.center_attendance
    GROUP BY profile_id
),
active_loan_check AS (
    SELECT 
        user_id,
        COUNT(*) FILTER (WHERE status = 'active' OR status = 'pending') as active_or_pending_count,
        BOOL_OR(status = 'overdue') as has_overdue
    FROM public.loan_applications
    -- Left joining amortizations for overdue check if status wasn't directly in loan_applications
    -- but our schema has 'overdue' in amortizations and different statuses in loan_applications.
    -- Let's stick to loan_applications status for now.
    GROUP BY user_id
)
SELECT 
    p.id as profile_id,
    p.full_name,
    p.cbu_balance,
    p.membership_start_date,
    EXTRACT(DAY FROM (now() - p.membership_start_date)) / 7 as membership_weeks,
    COALESCE(am.attendance_rate, 0) as attendance_rate,
    COALESCE(alc.active_or_pending_count, 0) as active_applications,
    COALESCE(alc.has_overdue, false) as has_overdue,
    -- Simple flag for overall eligibility (this can be product-specific, but here's a general one)
    (
        p.cbu_balance >= 2500 AND 
        COALESCE(am.attendance_rate, 0) >= 0.80 AND 
        COALESCE(alc.has_overdue, false) = false AND
        COALESCE(alc.active_or_pending_count, 0) = 0
    ) as is_generally_eligible
FROM public.profiles p
LEFT JOIN attendance_metrics am ON p.id = am.profile_id
LEFT JOIN active_loan_check alc ON p.id = alc.user_id;

-- RLS Policies for new table
ALTER TABLE public.center_attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own attendance" 
ON public.center_attendance FOR SELECT 
USING (auth.uid() = profile_id);

CREATE POLICY "Officers can manage attendance for their center"
ON public.center_attendance FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND (role = 'officer' OR role = 'admin')
  )
);
