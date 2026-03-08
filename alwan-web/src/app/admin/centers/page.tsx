'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GlassyButton } from '@/components/ui/glassy-button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Users, MapPin } from 'lucide-react'

// TODO: Replace with real data from Supabase
const mockCenters = [
    {
        id: '1',
        name: 'Barangay Commonwealth Center',
        code: 'BCC-001',
        leaderName: 'Maria Santos',
        meetingLocation: 'Barangay Hall, Commonwealth Ave',
        meetingDay: 'Monday',
        meetingTime: '09:00 AM',
        memberCount: 25,
        activeLoans: 18,
        branchName: 'Quezon City Branch',
        isActive: true
    },
    {
        id: '2',
        name: 'Fairview Heights Center',
        code: 'FHC-002',
        leaderName: 'Ana Reyes',
        meetingLocation: 'Community Center, Fairview',
        meetingDay: 'Wednesday',
        meetingTime: '10:00 AM',
        memberCount: 30,
        activeLoans: 22,
        branchName: 'Quezon City Branch',
        isActive: true
    },
    {
        id: '3',
        name: 'Batasan Hills Center',
        code: 'BHC-003',
        leaderName: 'Rosa Cruz',
        meetingLocation: 'Covered Court, Batasan',
        meetingDay: 'Friday',
        meetingTime: '02:00 PM',
        memberCount: 20,
        activeLoans: 15,
        branchName: 'Quezon City Branch',
        isActive: true
    }
]

export default function CentersPage() {
    const [searchQuery, setSearchQuery] = useState('')

    const filteredCenters = mockCenters.filter(center =>
        center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        center.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        center.leaderName.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Centers</h1>
                    <p className="text-gray-500 mt-1">Manage trust banking centers and members</p>
                </div>
                <Link href="/admin/centers/new">
                    <GlassyButton icon={<Plus className="h-4 w-4" />}>
                        New Center
                    </GlassyButton>
                </Link>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search by center name, code, or leader..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Centers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCenters.map((center) => (
                    <Link key={center.id} href={`/admin/centers/${center.id}`}>
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg">{center.name}</CardTitle>
                                        <p className="text-sm text-gray-500 mt-1">{center.code}</p>
                                    </div>
                                    <Badge variant={center.isActive ? 'success' : 'secondary'}>
                                        {center.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <Users className="h-4 w-4 text-gray-400" />
                                    <span className="text-gray-600">Leader:</span>
                                    <span className="font-medium">{center.leaderName}</span>
                                </div>

                                <div className="flex items-start gap-2 text-sm">
                                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-gray-600">{center.meetingLocation}</p>
                                        <p className="text-gray-500 text-xs mt-1">
                                            {center.meetingDay}s at {center.meetingTime}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500">Members</p>
                                        <p className="text-lg font-semibold" style={{ color: 'var(--kmbi-green)' }}>
                                            {center.memberCount}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Active Loans</p>
                                        <p className="text-lg font-semibold" style={{ color: 'var(--kmbi-green)' }}>
                                            {center.activeLoans}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {filteredCenters.length === 0 && (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-gray-500">No centers found matching your search.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
