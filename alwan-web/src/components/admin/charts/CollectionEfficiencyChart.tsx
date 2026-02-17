'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface CollectionEfficiencyChartProps {
    data?: Array<{
        date: string
        expected: number
        collected: number
        efficiency: number
    }>
}

export function CollectionEfficiencyChart({ data }: CollectionEfficiencyChartProps) {
    // Mock data if none provided
    const chartData = data || [
        { date: 'Week 1', expected: 150000, collected: 145000, efficiency: 96.7 },
        { date: 'Week 2', expected: 152000, collected: 148000, efficiency: 97.4 },
        { date: 'Week 3', expected: 148000, collected: 142000, efficiency: 95.9 },
        { date: 'Week 4', expected: 155000, collected: 153000, efficiency: 98.7 },
    ]

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
        }).format(value)
    }

    const avgEfficiency = chartData.reduce((sum, item) => sum + item.efficiency, 0) / chartData.length

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Collection Efficiency</span>
                    <span className={`text-2xl font-bold ${avgEfficiency >= 95 ? 'text-green-600' : avgEfficiency >= 90 ? 'text-orange-600' : 'text-red-600'
                        }`}>
                        {avgEfficiency.toFixed(1)}%
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" fontSize={12} />
                        <YAxis
                            yAxisId="left"
                            fontSize={12}
                            tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            fontSize={12}
                            tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip
                            formatter={(value: number, name: string) => {
                                if (name === 'efficiency') return `${value.toFixed(1)}%`
                                return formatCurrency(value)
                            }}
                            contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                        />
                        <Legend />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="expected"
                            stroke="#94A3B8"
                            strokeWidth={2}
                            name="Expected"
                            dot={{ r: 4 }}
                        />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="collected"
                            stroke="#009245"
                            strokeWidth={2}
                            name="Collected"
                            dot={{ r: 4 }}
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="efficiency"
                            stroke="#F59E0B"
                            strokeWidth={2}
                            name="Efficiency %"
                            dot={{ r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>

                {/* Summary */}
                <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-gray-50">
                        <p className="text-xs text-gray-600 mb-1">Total Expected</p>
                        <p className="text-lg font-bold text-gray-900">
                            {formatCurrency(chartData.reduce((sum, item) => sum + item.expected, 0))}
                        </p>
                    </div>
                    <div className="p-4 rounded-lg bg-green-50">
                        <p className="text-xs text-gray-600 mb-1">Total Collected</p>
                        <p className="text-lg font-bold text-green-700">
                            {formatCurrency(chartData.reduce((sum, item) => sum + item.collected, 0))}
                        </p>
                    </div>
                    <div className="p-4 rounded-lg bg-orange-50">
                        <p className="text-xs text-gray-600 mb-1">Avg Efficiency</p>
                        <p className="text-lg font-bold text-orange-700">{avgEfficiency.toFixed(1)}%</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
