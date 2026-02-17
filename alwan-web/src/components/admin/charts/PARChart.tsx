'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface PARChartProps {
    data?: {
        par_1_30_amount: number
        par_1_30_count: number
        par_31_60_amount: number
        par_31_60_count: number
        par_61_90_amount: number
        par_61_90_count: number
        par_over_90_amount: number
        par_over_90_count: number
        total_portfolio: number
        par_rate: number
    }
}

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#7C3AED']

export function PARChart({ data }: PARChartProps) {
    if (!data) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Portfolio at Risk (PAR)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64 flex items-center justify-center text-gray-500">
                        No PAR data available
                    </div>
                </CardContent>
            </Card>
        )
    }

    const chartData = [
        {
            name: '1-30 Days',
            amount: data.par_1_30_amount,
            count: data.par_1_30_count,
        },
        {
            name: '31-60 Days',
            amount: data.par_31_60_amount,
            count: data.par_31_60_count,
        },
        {
            name: '61-90 Days',
            amount: data.par_61_90_amount,
            count: data.par_61_90_count,
        },
        {
            name: '90+ Days',
            amount: data.par_over_90_amount,
            count: data.par_over_90_count,
        },
    ]

    const pieData = chartData.map((item, index) => ({
        name: item.name,
        value: item.amount,
        color: COLORS[index],
    }))

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
        }).format(value)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Portfolio at Risk (PAR)</span>
                    <span className={`text-2xl font-bold ${data.par_rate > 5 ? 'text-red-600' : data.par_rate > 3 ? 'text-orange-600' : 'text-green-600'
                        }`}>
                        {data.par_rate.toFixed(2)}%
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Bar Chart */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-4">PAR by Aging Bucket</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" fontSize={12} />
                                <YAxis fontSize={12} tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`} />
                                <Tooltip
                                    formatter={(value: any) => formatCurrency(Number(value))}
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                                />
                                <Legend />
                                <Bar dataKey="amount" fill="#009245" name="Amount at Risk" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Pie Chart */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-4">PAR Distribution</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent ? percent * 100 : 0).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {chartData.map((item, index) => (
                        <div key={item.name} className="p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                                <p className="text-xs text-gray-600">{item.name}</p>
                            </div>
                            <p className="text-lg font-bold text-gray-900">{formatCurrency(item.amount)}</p>
                            <p className="text-xs text-gray-500">{item.count} loans</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
