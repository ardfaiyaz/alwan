'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3 } from 'lucide-react'

export default function ReportsPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
                <p className="text-gray-500 mt-1">Portfolio analytics and performance metrics</p>
            </div>

            {/* Placeholder */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" style={{ color: 'var(--kmbi-blue)' }} />
                        Reports & Analytics
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12">
                        <BarChart3 className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Coming Soon</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            Advanced reporting and analytics features will be available here, including:
                        </p>
                        <ul className="mt-4 text-sm text-gray-600 space-y-2 max-w-md mx-auto text-left">
                            <li>• Portfolio at Risk (PAR) analysis by center and branch</li>
                            <li>• Collection efficiency trends over time</li>
                            <li>• Loan disbursement and repayment reports</li>
                            <li>• Member growth and retention metrics</li>
                            <li>• CBU (Capital Build-Up) accumulation reports</li>
                            <li>• Export to Excel/PDF functionality</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
