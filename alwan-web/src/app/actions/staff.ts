'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const StaffSchema = z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    role: z.enum(['admin', 'area_manager', 'branch_manager', 'field_officer']),
    phone: z.string().optional(),
    password: z.string().min(6), // Only for creation
    areaId: z.string().uuid().optional().nullable(),
    branchId: z.string().uuid().optional().nullable(),
})

export type Staff = {
    id: string
    fullName: string
    email: string
    role: 'admin' | 'area_manager' | 'branch_manager' | 'field_officer'
    phone?: string | null
    isActive: boolean
    createdAt: string
    branch?: { id: string; name: string } | null
    area?: { id: string; name: string } | null
}

export async function getStaffMembers() {
    const supabase = await createClient()

    const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
      *,
      branch:branches(id, name),
      area:areas(id, name)
    `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching staff:', error)
        throw new Error('Failed to fetch staff members')
    }

    return profiles.map((p: any) => ({
        id: p.id,
        fullName: p.full_name,
        email: p.email,
        role: p.role,
        phone: p.phone,
        isActive: p.is_active,
        createdAt: p.created_at,
        branch: p.branch,
        area: p.area,
    })) as Staff[]
}

export async function createStaffMember(data: z.infer<typeof StaffSchema>) {
    const adminClient = createAdminClient()
    const supabase = await createClient()

    // 1. Verify permissions (only admin can create staff)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { data: currentUserProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (currentUserProfile?.role !== 'admin') {
        throw new Error('Only admins can create staff members')
    }

    // 2. Create Auth User
    const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
        user_metadata: {
            full_name: data.fullName,
            role: data.role
        }
    })

    if (authError) {
        console.error('Auth creation error:', authError)
        throw new Error(authError.message)
    }

    if (!authUser.user) throw new Error('Failed to create user')

    // 3. Create Profile (check if trigger already created it)
    const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', authUser.user.id)
        .single()

    if (existingProfile) {
        // Update existing profile
        const { error: updateError } = await adminClient
            .from('profiles')
            .update({
                full_name: data.fullName,
                role: data.role,
                phone: data.phone,
                area_id: data.areaId,
                branch_id: data.branchId,
                is_active: true
            })
            .eq('id', authUser.user.id)

        if (updateError) throw updateError
    } else {
        // Insert if not exists
        const { error: profileError } = await adminClient
            .from('profiles')
            .insert({
                id: authUser.user.id,
                email: data.email,
                full_name: data.fullName,
                role: data.role,
                phone: data.phone,
                area_id: data.areaId,
                branch_id: data.branchId,
                is_active: true
            })

        if (profileError) throw profileError
    }

    revalidatePath('/admin/staffs')
    return { success: true }
}

export async function updateStaffMember(id: string, data: Partial<z.infer<typeof StaffSchema>>) {
    const supabase = await createClient()
    const adminClient = createAdminClient()

    // Verify permission
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // Update profile
    const { error } = await adminClient
        .from('profiles')
        .update({
            full_name: data.fullName,
            role: data.role,
            phone: data.phone,
            area_id: data.areaId,
            branch_id: data.branchId,
        })
        .eq('id', id)

    if (error) throw error

    // If email changed
    if (data.email) {
        await adminClient.auth.admin.updateUserById(id, { email: data.email })
    }

    // If password changed
    if (data.password) {
        await adminClient.auth.admin.updateUserById(id, { password: data.password })
    }

    revalidatePath('/admin/staffs')
    return { success: true }
}

export async function toggleStaffStatus(id: string, isActive: boolean) {
    const adminClient = createAdminClient()

    // Update profile status
    const { error } = await adminClient
        .from('profiles')
        .update({ is_active: isActive })
        .eq('id', id)

    if (error) throw error

    // Update auth user ban duration
    if (isActive) {
        await adminClient.auth.admin.updateUserById(id, { ban_duration: 'none' })
    } else {
        // Ban for 100 years to effectively deactivate login
        await adminClient.auth.admin.updateUserById(id, { ban_duration: '876000h' })
    }

    revalidatePath('/admin/staffs')
    return { success: true }
}

export async function getBranches() {
    const supabase = await createClient()
    const { data } = await supabase.from('branches').select('id, name, area_id').order('name')
    return data || []
}

export async function getAreas() {
    const supabase = await createClient()
    const { data } = await supabase.from('areas').select('id, name').order('name')
    return data || []
}
