'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GlassyButton } from '@/components/ui/glassy-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils/formatters'
import { processWeeklyCollection, getCenterMembersForCollection } from '@/app/actions/collections'
import { toast } from 'sonner'

interface MemberRow {
    memberId: string
    memberName: string
    loanId: string | null
    expectedLoan: number
    actualLoan: number
    expectedCBU: number
    actualCBU: number
    expectedInsurance: number
    actualInsurance: number
    isPresent: boolean
    notes: string
}

export default function WeeklyCollectionSheet() {
    const [centerId, setCenterId] = useState('')
    const [collectionDate, setCollectionDate] = useState(
        new Date().toISOString().split('T')[0]
    )
    const [members, setMembers] = useState<MemberRow[]>([])
    const [isSaving, setIsSaving] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Mock centers - replace with actual data from Supabase
    const centers = [
        { id: '1', name: 'Barangay Commonwealth Center' },
        { id: '2', name: 'Quezon City Center' },
        { id: '3', name: 'Manila Center' },
    ]

    // Load members when center is selected
    useEffect(() => {
        if (centerId) {
            loadCenterMembers()
        }
    }, [centerId])

    const loadCenterMembers = async () => {
        setIsLoading(true)
        try {
            // TODO: Replace with actual API call
            // const data = await getCenterMembersForCollection(centerId)

            // Mock data for demonstration
            const mockMembers: MemberRow[] = [
                {
                    memberId: '1',
                    memberName: 'Maria Santos',
                    loanId: 'loan-1',
                    expectedLoan: 500,
                    actualLoan: 500,
                    expectedCBU: 50,
                    actualCBU: 50,
                    expectedInsurance: 10,
                    actualInsurance: 10,
                    isPresent: true,
                    notes: ''
                },
                {
                    memberId: '2',
                    memberName: 'Juan Dela Cruz',
                    loanId: 'loan-2',
                    expectedLoan: 750,
                    actualLoan: 750,
                    expectedCBU: 75,
                    actualCBU: 75,
                    expectedInsurance: 10,
                    actualInsurance: 10,
                    isPresent: true,
                    notes: ''
                },
                {
                    memberId: '3',
                    memberName: 'Ana Garcia',
                    loanId: 'loan-3',
                    expectedLoan: 600,
                    actualLoan: 0,
                    expectedCBU: 60,
                    actualCBU: 0,
                    expectedInsurance: 10,
                    actualInsurance: 0,
                    isPresent: false,
                    notes: 'Absent - sick'
                },
            ]

            setMembers(mockMembers)
        } catch (error) {
            toast.error('Failed to load members')
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const updateMember = (index: number, field: keyof MemberRow, value: any) => {
        const updated = [...members]
        updated[index] = { ...updated[index], [field]: value }
        setMembers(updated)
    }

    const handleSaveCollection = async () => {
        if (!centerId) {
            toast.error('Please select a center')
            return
        }

        if (members.length === 0) {
            toast.error('No members to process')
            return
        }

        setIsSaving(true)
        try {
            const collectionData = {
                centerId,
                collectionDate,
                collections: members.map(m => ({
                    memberId: m.memberId,
                    loanId: m.loanId,
                    isPresent: m.isPresent,
                    actualLoanPayment: m.actualLoan,
                    actualCBUPayment: m.actualCBU,
                    actualInsurancePayment: m.actualInsurance,
                    notes: m.notes
                }))
            }

            // TODO: Uncomment when database is ready
            // const result = await processWeeklyCollection(collectionData)
            // toast.success(`Collection saved! Total: ${formatCurrency(result.totalCollected)}`)

            // Mock success for now
            await new Promise(resolve => setTimeout(resolve, 1500))
            toast.success('Collection saved successfully!')

        } catch (error: any) {
            toast.error(error.message || 'Failed to save collection')
            console.error(error)
        } finally {
            setIsSaving(false)
        }
    }

    // Calculate totals
    const totals = members.reduce(
        (acc, m) => ({
            expectedLoan: acc.expectedLoan + m.expectedLoan,
            actualLoan: acc.actualLoan + m.actualLoan,
            expectedCBU: acc.expectedCBU + m.expectedCBU,
            actualCBU: acc.actualCBU + m.actualCBU,
            expectedInsurance: acc.expectedInsurance + m.expectedInsurance,
            actualInsurance: acc.actualInsurance + m.actualInsurance,
            present: acc.present + (m.isPresent ? 1 : 0),
        }),
        {
            expectedLoan: 0,
            actualLoan: 0,
            expectedCBU: 0,
            actualCBU: 0,
            expectedInsurance: 0,
            actualInsurance: 0,
            present: 0,
        }
    )

    const grandTotal = totals.actualLoan + totals.actualCBU + totals.actualInsurance
    const attendanceRate = members.length > 0 ? (totals.present / members.length) * 100 : 0

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Weekly Collection Sheet</h1>
                    <p className="text-gray-500 mt-1">Process weekly loan repayments, CBU, and insurance premiums</p>
                </div>
                <Link href="/admin/collections">
                    <GlassyButton variant="ghost" className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Collections
                    </GlassyButton>
                </Link>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Collection Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="center">Center</Label>
                            <Select value={centerId} onValueChange={setCenterId}>
                                <SelectTrigger id="center">
                                    <SelectValue placeholder="Select center" />
                                </SelectTrigger>
                                <SelectContent>
                                    {centers.map(center => (
                                        <SelectItem key={center.id} value={center.id}>
                                            {center.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="date">Collection Date</Label>
                            <Input
                                id="date"
                                type="date"
                                value={collectionDate}
                                onChange={(e) => setCollectionDate(e.target.value)}
                                max={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Collection Grid */}
            {members.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Member Collections</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50">
                                        <th className="p-3 text-left text-sm font-semibold">Member</th>
                                        <th className="p-3 text-right text-sm font-semibold">Expected Loan</th>
                                        <th className="p-3 text-right text-sm font-semibold">Actual Loan</th>
                                        <th className="p-3 text-right text-sm font-semibold">Expected CBU</th>
                                        <th className="p-3 text-right text-sm font-semibold">Actual CBU</th>
                                        <th className="p-3 text-right text-sm font-semibold">K-Kalinga</th>
                                        <th className="p-3 text-center text-sm font-semibold">Present</th>
                                        <th className="p-3 text-right text-sm font-semibold">Total</th>
                                        <th className="p-3 text-left text-sm font-semibold">Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {members.map((member, index) => (
                                        <tr key={member.memberId} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="p-3 text-sm font-medium">{member.memberName}</td>
                                            <td className="p-3 text-right text-sm text-gray-600">
                                                {formatCurrency(member.expectedLoan)}
                                            </td>
                                            <td className="p-3">
                                                <Input
                                                    type="number"
                                                    value={member.actualLoan}
                                                    onChange={(e) => updateMember(index, 'actualLoan', parseFloat(e.target.value) || 0)}
                                                    className="w-24 text-right"
                                                    min="0"
                                                    step="0.01"
                                                />
                                            </td>
                                            <td className="p-3 text-right text-sm text-gray-600">
                                                {formatCurrency(member.expectedCBU)}
                                            </td>
                                            <td className="p-3">
                                                <Input
                                                    type="number"
                                                    value={member.actualCBU}
                                                    onChange={(e) => updateMember(index, 'actualCBU', parseFloat(e.target.value) || 0)}
                                                    className="w-24 text-right"
                                                    min="0"
                                                    step="0.01"
                                                />
                                            </td>
                                            <td className="p-3">
                                                <Input
                                                    type="number"
                                                    value={member.actualInsurance}
                                                    onChange={(e) => updateMember(index, 'actualInsurance', parseFloat(e.target.value) || 0)}
                                                    className="w-20 text-right"
                                                    min="0"
                                                    step="0.01"
                                                />
                                            </td>
                                            <td className="p-3 text-center">
                                                <Checkbox
                                                    checked={member.isPresent}
                                                    onCheckedChange={(checked) => updateMember(index, 'isPresent', checked)}
                                                />
                                            </td>
                                            <td className="p-3 text-right text-sm font-semibold">
                                                {formatCurrency(member.actualLoan + member.actualCBU + member.actualInsurance)}
                                            </td>
                                            <td className="p-3">
                                                <Input
                                                    value={member.notes}
                                                    onChange={(e) => updateMember(index, 'notes', e.target.value)}
                                                    placeholder="Notes..."
                                                    className="w-32"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Summary */}
                        <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Collection Summary</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Total Loan Payments</p>
                                    <p className="text-2xl font-bold text-green-700">{formatCurrency(totals.actualLoan)}</p>
                                    <p className="text-xs text-gray-500">Expected: {formatCurrency(totals.expectedLoan)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total CBU</p>
                                    <p className="text-2xl font-bold text-green-700">{formatCurrency(totals.actualCBU)}</p>
                                    <p className="text-xs text-gray-500">Expected: {formatCurrency(totals.expectedCBU)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Insurance</p>
                                    <p className="text-2xl font-bold text-green-700">{formatCurrency(totals.actualInsurance)}</p>
                                    <p className="text-xs text-gray-500">Expected: {formatCurrency(totals.expectedInsurance)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Grand Total</p>
                                    <p className="text-3xl font-bold text-green-800">{formatCurrency(grandTotal)}</p>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-green-200">
                                <p className="text-sm text-gray-600">
                                    Attendance: <span className="font-semibold">{totals.present}/{members.length}</span> ({attendanceRate.toFixed(1)}%)
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-6 flex justify-end gap-3">
                            <GlassyButton
                                variant="outline"
                                onClick={() => setMembers([])}
                                disabled={isSaving}
                            >
                                Clear
                            </GlassyButton>
                            <GlassyButton
                                onClick={handleSaveCollection}
                                isLoading={isSaving}
                                loadingText="Saving Collection..."
                                className="gap-2"
                            >
                                <Save className="w-4 h-4" />
                                Save Collection
                            </GlassyButton>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Empty State */}
            {members.length === 0 && centerId && !isLoading && (
                <Card>
                    <CardContent className="py-12 text-center">
                        <CheckCircle2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Members Found</h3>
                        <p className="text-gray-500">
                            This center has no active members with loans. Please check the center selection.
                        </p>
                    </CardContent>
                </Card>
            )}

            {!centerId && (
                <Card>
                    <CardContent className="py-12 text-center">
                        <CheckCircle2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Center</h3>
                        <p className="text-gray-500">
                            Choose a center and date to start processing weekly collections.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
