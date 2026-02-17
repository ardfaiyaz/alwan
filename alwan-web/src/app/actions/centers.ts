'use server'

import { prisma } from '@/lib/prisma/client'
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

        // Use transaction to ensure data integrity
        const result = await prisma.$transaction(async (tx: any) => {
            // 1. Get current center details for audit
            const center = await tx.center.findUnique({
                where: { id: validated.centerId },
                include: { branch: true, members: true }
            })

            if (!center) throw new Error('Center not found')
            if (center.branchId === validated.targetBranchId) {
                throw new Error('Center is already in the target branch')
            }

            // 2. Update center branch
            const updatedCenter = await tx.center.update({
                where: { id: validated.centerId },
                data: {
                    branchId: validated.targetBranchId,
                    updatedAt: new Date()
                },
                include: { branch: true }
            })

            // 3. Log the transfer in audit trail
            // Note: We'll do this outside the transaction or via the audit helper
            // which handles its own error catching to not block the main action

            return { prevBranch: center.branch, newBranch: updatedCenter.branch }
        })

        // 4. Log audit (outside transaction to avoid circular issues if audit fails)
        await logAudit({
            action: 'TRANSFER_CENTER',
            resourceType: 'center',
            resourceId: validated.centerId,
            oldValues: { branchId: result.prevBranch.id, branchName: result.prevBranch.name },
            newValues: { branchId: result.newBranch.id, branchName: result.newBranch.name, reason: validated.reason },
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
