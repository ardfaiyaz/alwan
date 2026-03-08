'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GlassyButton } from '@/components/ui/glassy-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Save, Calendar } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/formatters'

// TODO: Replace with real data from Supabase
const mockMembers = [
    {
        id: '1',
        name: 'Maria Santos',
        activeLoan: {
            id: '1',
            weeklyPayment: 750,
            outstandingBalance: 22500
        },
        cbuBalance: 1500
    },
    {
        id: '2',
        name: 'Ana Reyes',
        activeLoan: {
            id: '2',
            weeklyPayment: 625,
            outstandingBalance: 18750
        },
        cbuBalance: 1250
    },
    {
        id: '3',
        name: 'Rosa Cruz',
        activeLoan: {
            id: '3',
            weeklyPayment: 875,
            outstandingBalance: 26250
        },
        cbuBalance: 1750
    }
]

export default function CollectionsPage() {
    const [selectedCenter, setSelectedCenter] = useState('')
    const [collectionDate, setCollectionDate] = useState(new Date().toISOString().split('T')[0])
    const [collections, setCollections] = useState<Record<string, { loanPayment: number; cbuPayment: number; attended: boolean }>>({})
    const [isSaving, setIsSaving] = useState(false)

    const handleCollectionChange = (memberId: string, field: 'loanPayment' | 'cbuPayment' | 'attended', value: number | boolean) => {
        setCollections(prev => ({
            ...prev,
            [memberId]: {
                ...prev[memberId],
                [field]: value
            }
        }))
    }

    const handleSaveCollections = async () => {
        setIsSaving(true)
        // TODO: Implement Server Action to save collections
        console.log('Saving collections:', { selectedCenter, collectionDate, collections })
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsSaving(false)
    }

    const totalCollected = Object.values(collections).reduce(
        (sum, col) => sum + (col.loanPayment || 0) + (col.cbuPayment || 0),
        0
    )

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Collections</h1>
                <p className="text-gray-500 mt-1">Record weekly collections from center meetings</p>
            </div>

            {/* Collection Setup */}
            <Card>
                <CardHeader>
                    <CardTitle>Collection Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="center">Select Center *</Label>
                            <Select value={selectedCenter} onValueChange={setSelectedCenter}>
                                <SelectTrigger id="center">
                                    <SelectValue placeholder="Choose a center" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Barangay Commonwealth Center</SelectItem>
                                    <SelectItem value="2">Fairview Heights Center</SelectItem>
                                    <SelectItem value="3">Batasan Hills Center</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="date">Collection Date *</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="date"
                                    type="date"
                                    value={collectionDate}
                                    onChange={(e) => setCollectionDate(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Members Collection Table */}
            {selectedCenter && (
                <>
                    <Card>
                        <CardHeader>
                            <CardTitle>Member Collections</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {mockMembers.map((member) => (
                                    <div key={member.id} className="p-4 border border-gray-200 rounded-lg space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                                                <p className="text-sm text-gray-500">
                                                    Expected: {formatCurrency(member.activeLoan.weeklyPayment)} •
                                                    Outstanding: {formatCurrency(member.activeLoan.outstandingBalance)}
                                                </p>
                                            </div>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={collections[member.id]?.attended || false}
                                                    onChange={(e) => handleCollectionChange(member.id, 'attended', e.target.checked)}
                                                    className="w-4 h-4 rounded border-gray-300"
                                                />
                                                <span className="text-sm text-gray-600">Present</span>
                                            </label>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor={`loan-${member.id}`}>Loan Payment (₱)</Label>
                                                <Input
                                                    id={`loan-${member.id}`}
                                                    type="number"
                                                    placeholder="0.00"
                                                    value={collections[member.id]?.loanPayment || ''}
                                                    onChange={(e) => handleCollectionChange(member.id, 'loanPayment', parseFloat(e.target.value) || 0)}
                                                    disabled={!collections[member.id]?.attended}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor={`cbu-${member.id}`}>CBU/Savings (₱)</Label>
                                                <Input
                                                    id={`cbu-${member.id}`}
                                                    type="number"
                                                    placeholder="0.00"
                                                    value={collections[member.id]?.cbuPayment || ''}
                                                    onChange={(e) => handleCollectionChange(member.id, 'cbuPayment', parseFloat(e.target.value) || 0)}
                                                    disabled={!collections[member.id]?.attended}
                                                />
                                            </div>
                                        </div>

                                        {collections[member.id]?.attended && (
                                            <div className="pt-2 border-t border-gray-100">
                                                <p className="text-sm text-gray-600">
                                                    Total: <span className="font-semibold" style={{ color: 'var(--kmbi-green)' }}>
                                                        {formatCurrency((collections[member.id]?.loanPayment || 0) + (collections[member.id]?.cbuPayment || 0))}
                                                    </span>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Summary */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Collected</p>
                                    <p className="text-2xl font-bold" style={{ color: 'var(--kmbi-green)' }}>
                                        {formatCurrency(totalCollected)}
                                    </p>
                                </div>
                                <GlassyButton
                                    onClick={handleSaveCollections}
                                    icon={<Save className="h-4 w-4" />}
                                    isLoading={isSaving}
                                    loadingText="Saving..."
                                >
                                    Save Collections
                                </GlassyButton>
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    )
}
