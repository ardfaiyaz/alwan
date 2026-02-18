'use client'

import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GlassyButton } from '@/components/ui/glassy-button'
import { RefreshCw, Users, DollarSign, TrendingUp, AlertTriangle, Target, Wallet } from 'lucide-react'
import { useDashboardStore } from '@/stores/useDashboardStore'
import { PARChart } from '@/components/admin/charts/PARChart'
import { CollectionEfficiencyChart } from '@/components/admin/charts/CollectionEfficiencyChart'
import { formatCurrency } from '@/lib/utils/formatters'

export default function AdminDashboard() {
    const { stats, isLoading, lastUpdated, refreshStats } = useDashboardStore()

    useEffect(() => {
        if (!stats) {
            refreshStats()
        }
    }, [stats, refreshStats])

    const handleRefresh = () => {
        refreshStats()
    }

    if (isLoading && !stats) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">
                        Real-time overview of KMBI operations
                        {lastUpdated && (
                            <span className="ml-2 text-xs">
                                • Last updated: {new Date(lastUpdated).toLocaleTimeString()}
                            </span>
                        )}
                    </p>
                </div>
                <GlassyButton
                    onClick={handleRefresh}
                    isLoading={isLoading}
                    loadingText="Refreshing..."
                    className="gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </GlassyButton>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Members</p>
                                <p className="text-3xl font-bold text-gray-900">{stats?.totalMembers.toLocaleString()}</p>
                                <p className="text-xs text-green-600 mt-1">↑ 12% from last month</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <Users className="w-8 h-8 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Active Loans</p>
                                <p className="text-3xl font-bold text-gray-900">{stats?.activeLoans.toLocaleString()}</p>
                                <p className="text-xs text-blue-600 mt-1">↑ 8% from last month</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Wallet className="w-8 h-8 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Portfolio</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {formatCurrency(stats?.totalPortfolio || 0).replace('.00', '')}
                                </p>
                                <p className="text-xs text-purple-600 mt-1">↑ 15% from last month</p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <DollarSign className="w-8 h-8 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">PAR Rate</p>
                                <p className="text-3xl font-bold text-gray-900">{stats?.parRate}%</p>
                                <p className="text-xs text-orange-600 mt-1">
                                    {(stats?.parRate || 0) < 3 ? '✓ Within target' : '⚠ Above target'}
                                </p>
                            </div>
                            <div className="p-3 bg-orange-100 rounded-lg">
                                <AlertTriangle className="w-8 h-8 text-orange-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Weekly Collection Progress */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Weekly Collection Progress
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Target</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(stats?.weeklyTarget || 0)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Collected</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {formatCurrency(stats?.weeklyCollected || 0)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Achievement</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {stats?.collectionRate}%
                                </p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                                style={{ width: `${Math.min(stats?.collectionRate || 0, 100)}%` }}
                            >
                                <span className="text-xs font-semibold text-white">
                                    {stats?.collectionRate}%
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6">
                <PARChart
                    data={{
                        par_1_30_amount: 125000,
                        par_1_30_count: 15,
                        par_31_60_amount: 85000,
                        par_31_60_count: 8,
                        par_61_90_amount: 45000,
                        par_61_90_count: 4,
                        par_over_90_amount: 25000,
                        par_over_90_count: 2,
                        total_portfolio: stats?.totalPortfolio || 0,
                        par_rate: stats?.parRate || 0,
                    }}
                />
                <CollectionEfficiencyChart />
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <GlassyButton variant="outline" className="h-20 flex-col gap-2">
                            <Users className="w-6 h-6" />
                            <span className="text-sm">New Member</span>
                        </GlassyButton>
                        <GlassyButton variant="outline" className="h-20 flex-col gap-2">
                            <DollarSign className="w-6 h-6" />
                            <span className="text-sm">New Loan</span>
                        </GlassyButton>
                        <GlassyButton variant="outline" className="h-20 flex-col gap-2">
                            <Wallet className="w-6 h-6" />
                            <span className="text-sm">Weekly Collection</span>
                        </GlassyButton>
                        <GlassyButton variant="outline" className="h-20 flex-col gap-2">
                            <TrendingUp className="w-6 h-6" />
                            <span className="text-sm">View Reports</span>
                        </GlassyButton>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
