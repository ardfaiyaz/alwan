'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { GlassyButton } from '@/components/ui/glassy-button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Search } from 'lucide-react'
import { formatCurrency, formatDate, formatLoanStatus, formatLoanType } from '@/lib/utils/formatters'

// TODO: Replace with real data from Supabase
const mockLoans = [
    {
        id: '1',
        memberName: 'Maria Santos',
        centerName: 'Barangay Commonwealth Center',
        loanType: 'kabalikat',
        principalAmount: 30000,
        status: 'active',
        disbursementDate: '2024-01-15',
        outstandingBalance: 22500,
        weeklyPayment: 750
    },
    {
        id: '2',
        memberName: 'Ana Reyes',
        centerName: 'Fairview Heights Center',
        loanType: 'maunlad',
        principalAmount: 45000,
        status: 'pending_branch_manager',
        disbursementDate: null,
        outstandingBalance: 45000,
        weeklyPayment: 1125
    },
    {
        id: '3',
        memberName: 'Rosa Cruz',
        centerName: 'Batasan Hills Center',
        loanType: 'kabalikat',
        principalAmount: 25000,
        status: 'disbursed',
        disbursementDate: '2024-02-01',
        outstandingBalance: 25000,
        weeklyPayment: 625
    }
]

function LoanCard({ loan }: { loan: typeof mockLoans[0] }) {
    const statusInfo = formatLoanStatus(loan.status)

    return (
        <Link href={`/admin/loans/${loan.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg text-gray-900">{loan.memberName}</h3>
                            <p className="text-sm text-gray-500">{loan.centerName}</p>
                        </div>
                        <Badge className={`${statusInfo.bgColor} ${statusInfo.color} border-0`}>
                            {statusInfo.label}
                        </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-500">Loan Type</p>
                            <p className="font-medium">{formatLoanType(loan.loanType)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Principal</p>
                            <p className="font-medium">{formatCurrency(loan.principalAmount)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Outstanding</p>
                            <p className="font-medium" style={{ color: 'var(--kmbi-green)' }}>
                                {formatCurrency(loan.outstandingBalance)}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Weekly Payment</p>
                            <p className="font-medium">{formatCurrency(loan.weeklyPayment)}</p>
                        </div>
                    </div>

                    {loan.disbursementDate && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-500">
                                Disbursed on {formatDate(loan.disbursementDate)}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </Link>
    )
}

export default function LoansPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState('all')

    const filterLoansByStatus = (status?: string) => {
        let filtered = mockLoans

        if (status) {
            filtered = filtered.filter(loan => loan.status === status)
        }

        if (searchQuery) {
            filtered = filtered.filter(loan =>
                loan.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                loan.centerName.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        return filtered
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Loans</h1>
                    <p className="text-gray-500 mt-1">Manage loan applications and approvals</p>
                </div>
                <Link href="/admin/loans/new">
                    <GlassyButton icon={<Plus className="h-4 w-4" />}>
                        New Loan Application
                    </GlassyButton>
                </Link>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search by member name or center..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="all">All Loans</TabsTrigger>
                    <TabsTrigger value="pending">Pending Approval</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filterLoansByStatus().map((loan) => (
                            <LoanCard key={loan.id} loan={loan} />
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="pending" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filterLoansByStatus('pending_branch_manager').map((loan) => (
                            <LoanCard key={loan.id} loan={loan} />
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="active" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filterLoansByStatus('active').map((loan) => (
                            <LoanCard key={loan.id} loan={loan} />
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="completed" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filterLoansByStatus('completed').map((loan) => (
                            <LoanCard key={loan.id} loan={loan} />
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
