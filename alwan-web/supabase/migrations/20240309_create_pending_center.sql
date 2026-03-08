-- Create a default "Pending Assignment" center for new member signups
-- This center will be used temporarily until admin assigns members to proper centers

-- First, ensure we have a default branch (or use existing one)
DO $$
DECLARE
    default_branch_id uuid;
    pending_center_id uuid;
BEGIN
    -- Get or create a default branch
    SELECT id INTO default_branch_id
    FROM public.branches
    WHERE code = 'DEFAULT'
    LIMIT 1;

    -- If no default branch exists, create one
    IF default_branch_id IS NULL THEN
        -- First, get or create a default area
        INSERT INTO public.areas (name, code, description, is_active)
        VALUES ('Default Area', 'DEFAULT', 'Default area for system operations', true)
        ON CONFLICT (code) DO NOTHING;

        -- Get the default area id
        SELECT id INTO default_branch_id
        FROM public.areas
        WHERE code = 'DEFAULT'
        LIMIT 1;

        -- Create default branch
        INSERT INTO public.branches (area_id, name, code, address, is_active)
        VALUES (
            default_branch_id,
            'Default Branch',
            'DEFAULT',
            'System Default Branch',
            true
        )
        ON CONFLICT (code) DO NOTHING;

        -- Get the branch id
        SELECT id INTO default_branch_id
        FROM public.branches
        WHERE code = 'DEFAULT'
        LIMIT 1;
    END IF;

    -- Create pending center
    INSERT INTO public.centers (
        branch_id,
        name,
        code,
        meeting_location,
        meeting_day,
        meeting_time,
        is_active
    )
    VALUES (
        default_branch_id,
        'Pending Assignment',
        'PENDING',
        'To Be Assigned',
        'Monday',
        '09:00:00',
        true
    )
    ON CONFLICT (code) DO UPDATE
    SET 
        name = EXCLUDED.name,
        meeting_location = EXCLUDED.meeting_location,
        is_active = EXCLUDED.is_active;

    RAISE NOTICE 'Pending center created or updated successfully';
END $$;

-- Add a comment to the pending center
COMMENT ON TABLE public.centers IS 'Centers table - includes a PENDING center for new member signups';
