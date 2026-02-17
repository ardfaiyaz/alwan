'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GlassyButton } from '@/components/ui/glassy-button'
import { Plus, Search, Edit, Trash2, User, ArrowUpDown, Download, Eye, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

type SortField = 'first_name' | 'last_name' | 'center_name' | 'joined_date' | 'cbu_balance'
type SortOrder = 'asc' | 'desc'

type Member = {
    id: string
    first_name: string
    last_name: string
    middle_name: string | null
    date_of_birth: string
    gender: string
    phone: string | null
    address: string
    business_name: string | null
    business_type: string | null
    cbu_balance: number
    is_active: boolean
    joined_date: string
    center_id: string
    center?: {
        id: string
        name: string
        code: string
    }
}

type Center = {
    id: string
    name: string
    code: string
}

export default function MembersPage() {
    const [members, setMembers] = useState<Member[]>([])
    const [centers, setCenters] = useState<Center[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [centerFilter, setCenterFilter] = useState<string>('all')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [genderFilter, setGenderFilter] = useState<string>('all')
    const [sortField, setSortField] = useState<SortField>('joined_date')
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(15)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedMembers, setSelectedMembers] = useState<string[]>([])

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setIsLoading(true)
        try {
            const supabase = createClient()
            
            // Load members with center information
            const { data: membersData, error: membersError } = await supabase
                .from('members')
                .select(`
                    *,
                    center:centers(id, name, code)
                `)
                .order('joined_date', { ascending: false })

            if (membersError) throw membersError
            setMembers(membersData || [])

            // Load centers for filter
            const { data: centersData, error: centersError } = await supabase
                .from('centers')
                .select('id, name, code')
                .eq('is_active', true)
                .order('name')

            if (centersError) throw centersError
            setCenters(centersData || [])

        } catch (error) {
            console.error('Error loading data:', error)
            toast.error('Failed to load members data')
        } finally {
            setIsLoading(false)
        }
    }

    // Filter and sort members
    const filteredAndSortedMembers = members
        .filter(member => {
            const fullName = `${member.first_name} ${member.middle_name || ''} ${member.last_name}`.toLowerCase()
            const matchesSearch = fullName.includes(searchQuery.toLowerCase()) ||
                member.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                member.business_name?.toLowerCase().includes(searchQuery.toLowerCase())
            
            const matchesCenter = centerFilter === 'all' || member.center_id === centerFilter
            const matchesStatus = statusFilter === 'all' || 
                (statusFilter === 'active' && member.is_active) ||
                (statusFilter === 'inactive' && !member.is_active)
            const matchesGender = genderFilter === 'all' || member.gender === genderFilter
            
            return matchesSearch && matchesCenter && matchesStatus && matchesGender
        })
        .sort((a, b) => {
            let aVal: any
            let bVal: any

            if (sortField === 'center_name') {
                aVal = a.center?.name || ''
                bVal = b.center?.name || ''
            } else {
                aVal = a[sortField]
                bVal = b[sortField]
            }
            
            if (typeof aVal === 'string') aVal = aVal.toLowerCase()
            if (typeof bVal === 'string') bVal = bVal.toLowerCase()
            
            if (sortOrder === 'asc') {
                return aVal > bVal ? 1 : -1
            } else {
                return aVal < bVal ? 1 : -1
            }
        })

    // Pagination
    const totalPages = Math.ceil(filteredAndSortedMembers.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentMembers = filteredAndSortedMembers.slice(startIndex, endIndex)

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortOrder('asc')
        }
    }

    const handleSelectAll = () => {
        if (selectedMembers.length === currentMembers.length) {
            setSelectedMembers([])
        } else {
            setSelectedMembers(currentMembers.map(m => m.id))
        }
    }

    const handleSelectMember = (id: string) => {
        setSelectedMembers(prev => 
            prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
        )
    }

    const handleBulkDeactivate = async () => {
        if (selectedMembers.length === 0) return
        
        if (!confirm(`Deactivate ${selectedMembers.length} member(s)?`)) return

        try {
            const supabase = createClient()
            const { error } = await supabase
                .from('members')
                .update({ is_active: false })
                .in('id', selectedMembers)

            if (error) throw error

            toast.success(`${selectedMembers.length} member(s) deactivated`)
            setSelectedMembers([])
            loadData()
        } catch (error: any) {
            toast.error(error.message || 'Failed to deactivate members')
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this member? This action cannot be undone.')) {
            return
        }

        try {
            const supabase = createClient()
            const { error } = await supabase
                .from('members')
                .delete()
                .eq('id', id)

            if (error) throw error

            toast.success('Member deleted successfully')
            loadData()
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete member')
        }
    }

    const exportToCSV = () => {
        const headers = ['First Name', 'Last Name', 'Gender', 'Phone', 'Center', 'Business', 'CBU Balance', 'Status', 'Joined Date']
        const rows = filteredAndSortedMembers.map(member => [
            member.first_name,
            member.last_name,
            member.gender,
            member.phone || '',
            member.center?.name || '',
            member.business_name || '',
            member.cbu_balance,
            member.is_active ? 'Active' : 'Inactive',
            new Date(member.joined_date).toLocaleDateString()
        ])

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `members-export-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        toast.success('Members data exported successfully')
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP'
        }).format(amount)
    }

    const getFullName = (member: Member) => {
        return `${member.first_name} ${member.middle_name ? member.middle_name + ' ' : ''}${member.last_name}`
    }

    const getInitials = (member: Member) => {
        return `${member.first_name.charAt(0)}${member.last_name.charAt(0)}`.toUpperCase()
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Members</h1>
                    <p className="text-gray-500 mt-1">Manage trust banking members</p>
                </div>
                <div className="flex items-center gap-3">
                    <GlassyButton variant="outline" onClick={exportToCSV} className="gap-2">
                        <Download className="w-4 h-4" />
                        Export CSV
                    </GlassyButton>
                    <Link href="/admin/members/new">
                        <GlassyButton className="gap-2">
                            <Plus className="w-4 h-4" />
                            Add Member
                        </GlassyButton>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-1">Total Members</p>
                            <p className="text-3xl font-bold text-gray-900">{members.length}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-1">Active</p>
                            <p className="text-3xl font-bold text-green-600">
                                {members.filter(m => m.is_active).length}
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-1">Total CBU</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {formatCurrency(members.reduce((sum, m) => sum + m.cbu_balance, 0))}
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-1">Centers</p>
                            <p className="text-3xl font-bold text-purple-600">
                                {centers.length}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="relative md:col-span-2">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search by name, phone, or business..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value)
                                    setCurrentPage(1)
                                }}
                                className="pl-10"
                            />
                        </div>
                        <Select value={centerFilter} onValueChange={(value) => {
                            setCenterFilter(value)
                            setCurrentPage(1)
                        }}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by center" />
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
                        <Select value={genderFilter} onValueChange={(value) => {
                            setGenderFilter(value)
                            setCurrentPage(1)
                        }}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Genders</SelectItem>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={(value) => {
                            setStatusFilter(value)
                            setCurrentPage(1)
                        }}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Bulk Actions */}
            {selectedMembers.length > 0 && (
                <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-blue-900">
                                {selectedMembers.length} member(s) selected
                            </p>
                            <div className="flex items-center gap-2">
                                <GlassyButton
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedMembers([])}
                                >
                                    Clear Selection
                                </GlassyButton>
                                <GlassyButton
                                    variant="outline"
                                    size="sm"
                                    onClick={handleBulkDeactivate}
                                    className="text-red-600 hover:text-red-700"
                                >
                                    Deactivate Selected
                                </GlassyButton>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
