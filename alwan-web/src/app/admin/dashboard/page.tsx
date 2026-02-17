'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, FileText, DollarSign, TrendingUp } from 'lucide-react'

export default function AdminDashboard() {
    // TODO: Fetch real data from Supabase
    const stats = [
        {
            title: 'Active Loans',
            value: '1,234',
            subtitle: '₱12,345,678.00',
            icon: FileText,
            color: 'var(--kmbi-green)'
        },
        {
            title: 'Active Borrowers',
            value: '856',
            subtitle: 'Across 45 centers',
            icon: Users,
            color: 'var(--kmbi-green)'
        },
        {
            title: 'Collection Efficiency',
            value: '98.5%',
            subtitle: 'This month',
            icon: TrendingUp,
            color: 'var(--kmbi-gold)'
        },
        {
            title: 'PAR-30',
            value: '2.3%',
            subtitle: 'Portfolio at Risk',
            icon: DollarSign,
            color: '#ef4444'
        }
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">Welcome to KMBI Admin Portal</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold" style={{ color: stat.color }}>
                                {stat.value}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-gray-500">
                        <p>Dashboard metrics and charts will be implemented here.</p>
                        <p className="mt-2">This will include:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Loan disbursement trends (last 12 months)</li>
                            <li>Collection rate by center</li>
                            <li>Pending approvals requiring action</li>
                            <li>Upcoming collections</li>
                            <li>Overdue payments</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
