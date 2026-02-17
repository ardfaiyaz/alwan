'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GlassyButton } from '@/components/ui/glassy-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ArrowRight, Users, Building2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { transferCenter } from '@/app/actions/centers'

interface Center {
    id: string
    name: string
    code: string
    branchId: string
    memberCount: number
}

export default function TransferCenterPage() {
    const [selectedCenter, setSelectedCenter] = useState('')
    const [targetBranch, setTargetBranch] = useState('')
    const [reason, setReason] = useState('')
    const [isTransferring, setIsTransferring] = useState(false)

    // Mock data - replace with actual API calls
    const centers: Center[] = [
        { id: '1', name: 'Commonwealth Center', code: 'CC-001', branchId: 'branch-1', memberCount: 45 },
        { id: '2', name: 'Quezon City Center', code: 'QC-002', branchId: 'branch-1', memberCount: 38 },
        { id: '3', name: 'Manila Center', code: 'MN-003', branchId: 'branch-2', memberCount: 52 },
    ]

    const branches = [
        { id: 'branch-1', name: 'Metro Manila North Branch', code: 'MMN-01' },
        { id: 'branch-2', name: 'Metro Manila South Branch', code: 'MMS-02' },
        { id: 'branch-3', name: 'Quezon Province Branch', code: 'QPR-03' },
    ]

    const selectedCenterData = centers.find(c => c.id === selectedCenter)
    const currentBranch = branches.find(b => b.id === selectedCenterData?.branchId)
    const newBranch = branches.find(b => b.id === targetBranch)

    const handleTransfer = async () => {
        if (!selectedCenter || !targetBranch || !reason) {
            toast.error('Please fill in all required fields')
            return
        }

        if (selectedCenterData?.branchId === targetBranch) {
            toast.error('Center is already in the selected branch')
            return
        }

        setIsTransferring(true)
        try {
            const result = await transferCenter({
                centerId: selectedCenter,
                targetBranchId: targetBranch,
                reason: reason
            })

            if (result.success) {
                toast.success(result.message)
                // Reset form
                setSelectedCenter('')
                setTargetBranch('')
                setReason('')
            } else {
                toast.error(result.error || 'Failed to transfer center')
            }
        } catch (error) {
            toast.error('An unexpected error occurred')
        } finally {
            setIsTransferring(false)
        }
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Transfer Center</h1>
                <p className="text-gray-500 mt-1">Move a center from one branch to another</p>
            </div>

            {/* Warning Notice */}
            <Card className="border-orange-200 bg-orange-50">
                <CardContent className="pt-6">
                    <div className="flex gap-3">
                        <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-orange-900">Important Notice</h3>
                            <p className="text-sm text-orange-800 mt-1">
                                Transferring a center will move all its members, loans, and collection history to the new branch.
                                This action requires super admin privileges and will be logged in the audit trail.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Transfer Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Transfer Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Select Center */}
                    <div>
                        <Label htmlFor="center">Select Center to Transfer</Label>
                        <Select value={selectedCenter} onValueChange={setSelectedCenter}>
                            <SelectTrigger id="center">
                                <SelectValue placeholder="Choose a center..." />
                            </SelectTrigger>
                            <SelectContent>
                                {centers.map(center => (
                                    <SelectItem key={center.id} value={center.id}>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{center.name}</span>
                                            <span className="text-xs text-gray-500">({center.code})</span>
                                            <span className="text-xs text-gray-400">• {center.memberCount} members</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Current Branch Info */}
                    {selectedCenterData && currentBranch && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-2">Current Branch</p>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg">
                                    <Building2 className="w-5 h-5 text-gray-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{currentBranch.name}</p>
                                    <p className="text-sm text-gray-500">{currentBranch.code}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Transfer Arrow */}
                    {selectedCenterData && (
                        <div className="flex justify-center">
                            <div className="p-3 bg-green-100 rounded-full">
                                <ArrowRight className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    )}

                    {/* Target Branch */}
                    <div>
                        <Label htmlFor="targetBranch">Transfer to Branch</Label>
                        <Select value={targetBranch} onValueChange={setTargetBranch}>
                            <SelectTrigger id="targetBranch">
                                <SelectValue placeholder="Choose target branch..." />
                            </SelectTrigger>
                            <SelectContent>
                                {branches
                                    .filter(b => b.id !== selectedCenterData?.branchId)
                                    .map(branch => (
                                        <SelectItem key={branch.id} value={branch.id}>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{branch.name}</span>
                                                <span className="text-xs text-gray-500">({branch.code})</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* New Branch Info */}
                    {newBranch && (
                        <div className="p-4 bg-green-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-2">New Branch</p>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg">
                                    <Building2 className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{newBranch.name}</p>
                                    <p className="text-sm text-gray-500">{newBranch.code}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Reason */}
                    <div>
                        <Label htmlFor="reason">Reason for Transfer *</Label>
                        <Textarea
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Explain why this center is being transferred..."
                            rows={4}
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            This will be recorded in the audit log
                        </p>
                    </div>

                    {/* Summary */}
                    {selectedCenterData && currentBranch && newBranch && (
                        <div className="p-4 border-2 border-green-200 bg-green-50 rounded-lg">
                            <h3 className="font-semibold text-gray-900 mb-3">Transfer Summary</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-gray-600" />
                                    <span className="text-gray-600">Center:</span>
                                    <span className="font-semibold">{selectedCenterData.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-gray-600" />
                                    <span className="text-gray-600">Members affected:</span>
                                    <span className="font-semibold">{selectedCenterData.memberCount}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-gray-600" />
                                    <span className="text-gray-600">From:</span>
                                    <span className="font-semibold">{currentBranch.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-green-600" />
                                    <span className="text-gray-600">To:</span>
                                    <span className="font-semibold text-green-700">{newBranch.name}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <GlassyButton
                            variant="outline"
                            onClick={() => {
                                setSelectedCenter('')
                                setTargetBranch('')
                                setReason('')
                            }}
                        >
                            Reset
                        </GlassyButton>
                        <GlassyButton
                            onClick={handleTransfer}
                            isLoading={isTransferring}
                            loadingText="Transferring..."
                            disabled={!selectedCenter || !targetBranch || !reason}
                        >
                            Transfer Center
                        </GlassyButton>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
