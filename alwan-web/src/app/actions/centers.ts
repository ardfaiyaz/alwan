'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { logAudit } from './audit'
import { z } from 'zod'

const transferCenterSchema = z.object({
    centerId: z.string().uuid(),
    targetBranchId: z.string().uuid(),
    reason: z.string().min(10, 'Reason must be at least 10 characters'),
})

export async function transferCenter(formData: {
    centerId: string
    targetBranchId: string
    reason: string
}) {
    try {
        const validated = transferCenterSchema.parse(formData)
        const supabase = await createClient()

        // 1. Get current center details
        const { data: center, error: fetchError } = await supabase
            .from('centers')
            .select('*, branch:branches(*)')
            .eq('id', validated.centerId)
            .single()

        if (fetchError || !center) throw new Error('Center not found')

        if (center.branch_id === validated.targetBranchId) {
            throw new Error('Center is already in the target branch')
        }

        const prevBranch = center.branch

        // 2. Update center branch
        const { data: updatedCenter, error: updateError } = await supabase
            .from('centers')
            .update({
                branch_id: validated.targetBranchId,
                updated_at: new Date().toISOString()
            })
            .eq('id', validated.centerId)
            .select('*, branch:branches(*)')
            .single()

        if (updateError) throw updateError

        const newBranch = updatedCenter.branch

        // 3. Log audit
        await logAudit({
            action: 'TRANSFER_CENTER',
            resourceType: 'center',
            resourceId: validated.centerId,
            oldValues: { branchId: prevBranch.id, branchName: prevBranch.name },
            newValues: { branchId: newBranch.id, branchName: newBranch.name, reason: validated.reason },
            success: true
        })

        revalidatePath('/admin/centers')
        revalidatePath('/admin/settings/transfer-center')

        return { success: true, message: 'Center transferred successfully' }

    } catch (error: any) {
        console.error('Transfer center error:', error)
        return { success: false, error: error.message }
    }
}
