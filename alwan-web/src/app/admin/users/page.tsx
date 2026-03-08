'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GlassyButton } from '@/components/ui/glassy-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Search, UserCheck, UserX, ExternalLink, Loader2, MapPin, Phone } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import {
    getMembers,
    getCenters,
    toggleMemberStatus,
    type Member
} from '@/app/actions/members'

export default function MembersPage() {
    const [members, setMembers] = useState<Member[]>([])
    const [centers, setCenters] = useState<{ id: string; name: string }[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [centerFilter, setCenterFilter] = useState<string>('all')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setIsLoading(true)
        try {
            const [memberData, centerData] = await Promise.all([
                getMembers(),
                getCenters()
            ])
            setMembers(memberData)
            setCenters(centerData)
        } catch (error) {
            toast.error('Failed to load members')
        } finally {
            setIsLoading(false)
        }
    }

    const handleToggleStatus = async (member: Member) => {
        const newStatus = !member.isActive
        try {
            await toggleMemberStatus(member.id, newStatus)
            toast.success(`Member ${newStatus ? 'activated' : 'deactivated'} successfully`)
            loadData()
        } catch (error) {
            toast.error('Failed to update status')
        }
    }

    const filteredMembers = members.filter(member => {
        const matchesSearch =
            member.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (member.phone && member.phone.includes(searchQuery))

        const matchesCenter = centerFilter === 'all' || member.centerId === centerFilter
        return matchesSearch && matchesCenter
    })

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Member Management</h1>
                    <p className="text-gray-500 mt-1">Manage microfinance borrowers and their accounts</p>
                </div>
                {/* For creation, usually done via a more detailed multi-step form or a specific button */}
                <GlassyButton asChild className="gap-2">
                    <Link href="/admin/members/new">
                        <Plus className="w-4 h-4" />
                        Register Member
                    </Link>
                </GlassyButton>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search by name or phone..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={centerFilter} onValueChange={setCenterFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by Center" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Centers</SelectItem>
                                {centers.map(center => (
                                    <SelectItem key={center.id} value={center.id}>
                                        {center.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Members ({filteredMembers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="p-3 text-left text-sm font-semibold">Name</th>
                                    <th className="p-3 text-left text-sm font-semibold">Center</th>
                                    <th className="p-3 text-left text-sm font-semibold">CBU Balance</th>
                                    <th className="p-3 text-left text-sm font-semibold">Contact Info</th>
                                    <th className="p-3 text-left text-sm font-semibold">Status</th>
                                    <th className="p-3 text-right text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMembers.map((member) => (
                                    <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors group">
                                        <td className="p-3">
                                            <Link
                                                href={`/admin/members/${member.id}`}
                                                className="text-sm font-semibold text-gray-900 hover:text-green-600 flex items-center gap-1"
                                            >
                                                {member.firstName} {member.lastName}
                                                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </Link>
                                            <p className="text-xs text-gray-500">Joined {new Date(member.joinedDate).toLocaleDateString()}</p>
                                        </td>
                                        <td className="p-3">
                                            <span className="text-sm font-medium text-gray-700">
                                                {member.center?.name || 'Unassigned'}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <span className="text-sm font-bold text-gray-900">
                                                ₱{member.cbuBalance.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="p-3 space-y-1">
                                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                                <Phone className="w-3 h-3 text-gray-400" />
                                                {member.phone || 'No phone'}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                                <MapPin className="w-3 h-3 text-gray-400" />
                                                <span className="truncate max-w-[150px]">{member.address}</span>
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${member.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {member.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex items-center justify-end gap-2">
                                                <GlassyButton asChild variant="outline" className="p-2 h-auto">
                                                    <Link href={`/admin/members/${member.id}`}>
                                                        View Profile
                                                    </Link>
                                                </GlassyButton>
                                                <button
                                                    onClick={() => handleToggleStatus(member)}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                    title={member.isActive ? 'Deactivate' : 'Activate'}
                                                >
                                                    {member.isActive ? (
                                                        <UserX className="w-4 h-4 text-orange-600" />
                                                    ) : (
                                                        <UserCheck className="w-4 h-4 text-green-600" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredMembers.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No members found</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
