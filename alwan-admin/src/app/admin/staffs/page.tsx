'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GlassyButton } from '@/components/ui/glassy-button'
import { Plus, Search, Edit, Trash2, Shield, UserCheck, UserX, ArrowUpDown, Download, Eye, EyeOff, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { createAuditLog } from '@/app/actions/audit'
import { createStaff, updateStaff, toggleStaffStatus, checkEmailAvailability } from '@/app/actions/staff'
import { StatsCardSkeleton } from '@/components/skeletons/StatsCardSkeleton'
import { TableSkeleton } from '@/components/skeletons/TableSkeleton'
import { Skeleton } from '@/components/ui/Skeleton'
import { AdminOnly } from '@/components/auth/PermissionGate'

type UserRole = 'admin' | 'area_manager' | 'branch_manager' | 'field_officer'
type SortField = 'full_name' | 'email' | 'role' | 'created_at'
type SortOrder = 'asc' | 'desc'

type Staff = {
    id: string
    email: string
    full_name: string
    role: UserRole
    area_id: string | null
    branch_id: string | null
    phone: string | null
    is_active: boolean
    created_at: string
    updated_at: string
}

type Area = {
    id: string
    name: string
    code: string
}

type Branch = {
    id: string
    name: string
    code: string
    area_id: string
}

const ROLE_OPTIONS = [
    { value: 'admin', label: 'Super Admin', description: 'Full system access', color: 'bg-red-100 text-red-700' },
    { value: 'area_manager', label: 'Area Manager', description: 'Manages multiple branches', color: 'bg-blue-100 text-blue-700' },
    { value: 'branch_manager', label: 'Branch Manager', description: 'Manages a single branch', color: 'bg-green-100 text-green-700' },
    { value: 'field_officer', label: 'Field Officer', description: 'Manages centers and collections', color: 'bg-purple-100 text-purple-700' },
]

export default function StaffsPage() {
    const [staffs, setStaffs] = useState<Staff[]>([])
    const [areas, setAreas] = useState<Area[]>([])
    const [branches, setBranches] = useState<Branch[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [roleFilter, setRoleFilter] = useState<string>('all')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [sortField, setSortField] = useState<SortField>('created_at')
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedStaffs, setSelectedStaffs] = useState<string[]>([])
    const [formData, setFormData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        role: 'field_officer' as UserRole,
        area_id: '',
        branch_id: '',
        phone: '',
        password: '',
        confirm_password: ''
    })

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setIsLoading(true)
        try {
            const supabase = createClient()
            if (!supabase) {
                toast.error('Failed to initialize Supabase client')
                return
            }
            
            const { data: staffData, error: staffError } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false })

            if (staffError) throw staffError
            setStaffs(staffData || [])

            const { data: areaData, error: areaError } = await supabase
                .from('areas')
                .select('id, name, code')
                .eq('is_active', true)
                .order('name')

            if (areaError) throw areaError
            setAreas(areaData || [])

            const { data: branchData, error: branchError } = await supabase
                .from('branches')
                .select('id, name, code, area_id')
                .eq('is_active', true)
                .order('name')

            if (branchError) throw branchError
            setBranches(branchData || [])

        } catch (error) {
            console.error('Error loading data:', error)
            toast.error('Failed to load staff data')
        } finally {
            setIsLoading(false)
        }
    }

    // Filter and sort staffs
    const filteredAndSortedStaffs = staffs
        .filter(staff => {
            const matchesSearch = staff.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                staff.email.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesRole = roleFilter === 'all' || staff.role === roleFilter
            const matchesStatus = statusFilter === 'all' || 
                (statusFilter === 'active' && staff.is_active) ||
                (statusFilter === 'inactive' && !staff.is_active)
            return matchesSearch && matchesRole && matchesStatus
        })
        .sort((a, b) => {
            let aVal = a[sortField]
            let bVal = b[sortField]
            
            if (typeof aVal === 'string') aVal = aVal.toLowerCase()
            if (typeof bVal === 'string') bVal = bVal.toLowerCase()
            
            if (sortOrder === 'asc') {
                return aVal > bVal ? 1 : -1
            } else {
                return aVal < bVal ? 1 : -1
            }
        })

    // Pagination
    const totalPages = Math.ceil(filteredAndSortedStaffs.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentStaffs = filteredAndSortedStaffs.slice(startIndex, endIndex)

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortOrder('asc')
        }
    }

    const handleSelectAll = () => {
        if (selectedStaffs.length === currentStaffs.length) {
            setSelectedStaffs([])
        } else {
            setSelectedStaffs(currentStaffs.map(s => s.id))
        }
    }

    const handleSelectStaff = (id: string) => {
        setSelectedStaffs(prev => 
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        )
    }

    const handleBulkDeactivate = async () => {
        if (selectedStaffs.length === 0) return
        
        if (!confirm(`Deactivate ${selectedStaffs.length} staff member(s)?`)) return

        try {
            const supabase = createClient()
            if (!supabase) {
                toast.error('Failed to initialize Supabase client')
                return
            }
            const { error } = await supabase
                .from('profiles')
                .update({ is_active: false })
                .in('id', selectedStaffs)

            if (error) throw error

            // Create audit log for bulk action
            await createAuditLog({
                action: 'bulk_deactivate',
                resourceType: 'staff',
                resourceId: selectedStaffs.join(','),
                newValues: { count: selectedStaffs.length, staff_ids: selectedStaffs }
            })

            toast.success(`${selectedStaffs.length} staff member(s) deactivated`)
            setSelectedStaffs([])
            loadData()
        } catch (error: any) {
            toast.error(error.message || 'Failed to deactivate staff members')
        }
    }

    const exportToCSV = () => {
        const headers = ['Name', 'Email', 'Phone', 'Role', 'Area', 'Branch', 'Status', 'Created At']
        const rows = filteredAndSortedStaffs.map(staff => [
            staff.full_name,
            staff.email,
            staff.phone || '',
            getRoleLabel(staff.role),
            getAreaName(staff.area_id),
            getBranchName(staff.branch_id),
            staff.is_active ? 'Active' : 'Inactive',
            new Date(staff.created_at).toLocaleDateString()
        ])

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `staff-export-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        toast.success('Staff data exported successfully')
    }

    const handleAdd = async () => {
        if (!formData.username || !formData.first_name || !formData.last_name || !formData.password) {
            toast.error('Please fill in all required fields')
            return
        }

        if (formData.password !== formData.confirm_password) {
            toast.error('Passwords do not match')
            return
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters')
            return
        }

        try {
            const result = await createStaff({
                username: formData.username,
                first_name: formData.first_name,
                last_name: formData.last_name,
                role: formData.role,
                area_id: formData.area_id || undefined,
                branch_id: formData.branch_id || undefined,
                phone: formData.phone || undefined,
                password: formData.password
            })

            if (result.error) {
                toast.error(result.error)
                return
            }

            toast.success('Staff member added successfully')
            setIsAddDialogOpen(false)
            resetForm()
            loadData()
        } catch (error: any) {
            console.error('Error adding staff:', error)
            toast.error(error.message || 'Failed to add staff member')
        }
    }

    const handleEdit = (staff: Staff) => {
        setEditingStaff(staff)
        const nameParts = staff.full_name.split(' ')
        const firstName = nameParts[0] || ''
        const lastName = nameParts.slice(1).join(' ') || ''
        const username = staff.email.replace('@alwan.com', '')
        
        setFormData({
            username: username,
            first_name: firstName,
            last_name: lastName,
            role: staff.role,
            area_id: staff.area_id || '',
            branch_id: staff.branch_id || '',
            phone: staff.phone || '',
            password: '',
            confirm_password: ''
        })
        setIsEditDialogOpen(true)
    }

    const handleUpdate = async () => {
        if (!editingStaff) return

        try {
            const result = await updateStaff({
                id: editingStaff.id,
                first_name: formData.first_name,
                last_name: formData.last_name,
                role: formData.role,
                area_id: formData.area_id || undefined,
                branch_id: formData.branch_id || undefined,
                phone: formData.phone || undefined
            })

            if (result.error) {
                toast.error(result.error)
                return
            }

            toast.success('Staff member updated successfully')
            setIsEditDialogOpen(false)
            setEditingStaff(null)
            resetForm()
            loadData()
        } catch (error: any) {
            console.error('Error updating staff:', error)
            toast.error(error.message || 'Failed to update staff member')
        }
    }

    const handleToggleStatus = async (staff: Staff) => {
        try {
            const result = await toggleStaffStatus(staff.id, staff.is_active)

            if (result.error) {
                toast.error(result.error)
                return
            }

            toast.success(`Staff member ${!staff.is_active ? 'activated' : 'deactivated'} successfully`)
            loadData()
        } catch (error: any) {
            console.error('Error toggling status:', error)
            toast.error(error.message || 'Failed to update status')
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this staff member? This action cannot be undone.')) {
            return
        }

        try {
            const supabase = createClient()
            if (!supabase) {
                toast.error('Failed to initialize Supabase client')
                return
            }

            const { error } = await supabase
                .from('profiles')
                .update({ is_active: false })
                .eq('id', id)

            if (error) throw error

            // Create audit log
            await createAuditLog({
                action: 'delete',
                resourceType: 'staff',
                resourceId: id,
                oldValues: { is_active: true },
                newValues: { is_active: false }
            })

            toast.success('Staff member deactivated successfully')
            loadData()
        } catch (error: any) {
            console.error('Error deleting staff:', error)
            toast.error(error.message || 'Failed to delete staff member')
        }
    }

    const resetForm = () => {
        setFormData({
            username: '',
            first_name: '',
            last_name: '',
            role: 'field_officer',
            area_id: '',
            branch_id: '',
            phone: '',
            password: '',
            confirm_password: ''
        })
    }

    const getRoleBadge = (role: UserRole) => {
        return ROLE_OPTIONS.find(r => r.value === role)?.color || 'bg-gray-100 text-gray-700'
    }

    const getRoleLabel = (role: UserRole) => {
        return ROLE_OPTIONS.find(r => r.value === role)?.label || role
    }

    const getAreaName = (areaId: string | null) => {
        if (!areaId) return '-'
        return areas.find(a => a.id === areaId)?.name || '-'
    }

    const getBranchName = (branchId: string | null) => {
        if (!branchId) return '-'
        return branches.find(b => b.id === branchId)?.name || '-'
    }

    const filteredBranches = formData.area_id
        ? branches.filter(b => b.area_id === formData.area_id)
        : branches

    return (
        <AdminOnly>
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
                    <p className="text-gray-500 mt-1">Manage KMBI staff members and their roles</p>
                </div>
                <div className="flex items-center gap-3">
                    <GlassyButton variant="outline" onClick={exportToCSV} className="gap-2">
                        <Download className="w-4 h-4" />
                        Export CSV
                    </GlassyButton>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <GlassyButton className="gap-2">
                                <Plus className="w-4 h-4" />
                                Add Staff
                            </GlassyButton>
                        </DialogTrigger>
                        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Add New Staff Member</DialogTitle>
                                <DialogDescription>
                                    Create a new staff account with role and permissions
                                </DialogDescription>
                            </DialogHeader>
                            <StaffForm
                                formData={formData}
                                setFormData={setFormData}
                                areas={areas}
                                branches={filteredBranches}
                                onSubmit={handleAdd}
                                onCancel={() => setIsAddDialogOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                    
                    {/* Edit Staff Dialog */}
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Edit Staff Member</DialogTitle>
                                <DialogDescription>
                                    Update staff information and role assignments
                                </DialogDescription>
                            </DialogHeader>
                            <StaffForm
                                formData={formData}
                                setFormData={setFormData}
                                areas={areas}
                                branches={filteredBranches}
                                onSubmit={handleUpdate}
                                onCancel={() => {
                                    setIsEditDialogOpen(false)
                                    setEditingStaff(null)
                                }}
                                isEdit
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {isLoading ? (
                <>
                    {/* Stats Cards Skeleton */}
                    <StatsCardSkeleton count={4} />
                    
                    {/* Filters Skeleton */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </CardContent>
                    </Card>
                    
                    {/* Table Skeleton */}
                    <TableSkeleton rows={10} columns={7} />
                </>
            ) : (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-1">Total Staff</p>
                            <p className="text-3xl font-bold text-gray-900">{staffs.length}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-1">Active</p>
                            <p className="text-3xl font-bold text-green-600">
                                {staffs.filter(s => s.is_active).length}
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-1">Inactive</p>
                            <p className="text-3xl font-bold text-gray-600">
                                {staffs.filter(s => !s.is_active).length}
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-1">Field Officers</p>
                            <p className="text-3xl font-bold text-purple-600">
                                {staffs.filter(s => s.role === 'field_officer').length}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative md:col-span-2">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value)
                                    setCurrentPage(1)
                                }}
                                className="pl-10"
                            />
                        </div>
                        <Select value={roleFilter} onValueChange={(value) => {
                            setRoleFilter(value)
                            setCurrentPage(1)
                        }}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                {ROLE_OPTIONS.map(role => (
                                    <SelectItem key={role.value} value={role.value}>
                                        {role.label}
                                    </SelectItem>
                                ))}
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
            {selectedStaffs.length > 0 && (
                <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-blue-900">
                                {selectedStaffs.length} staff member(s) selected
                            </p>
                            <div className="flex items-center gap-2">
                                <GlassyButton
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedStaffs([])}
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

            {/* Staff Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>
                            Staff Members ({filteredAndSortedStaffs.length})
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                            <p className="text-gray-500">Loading staff data...</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b bg-gray-50">
                                            <th className="text-left py-4 px-4 w-12">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedStaffs.length === currentStaffs.length && currentStaffs.length > 0}
                                                    onChange={handleSelectAll}
                                                    className="rounded border-gray-300"
                                                />
                                            </th>
                                            <th className="text-left py-4 px-4 font-semibold text-gray-700">
                                                <button
                                                    onClick={() => handleSort('full_name')}
                                                    className="flex items-center gap-1 hover:text-gray-900"
                                                >
                                                    Name
                                                    <ArrowUpDown className="w-4 h-4" />
                                                </button>
                                            </th>
                                            <th className="text-left py-4 px-4 font-semibold text-gray-700">
                                                <button
                                                    onClick={() => handleSort('email')}
                                                    className="flex items-center gap-1 hover:text-gray-900"
                                                >
                                                    Email
                                                    <ArrowUpDown className="w-4 h-4" />
                                                </button>
                                            </th>
                                            <th className="text-left py-4 px-4 font-semibold text-gray-700">Phone</th>
                                            <th className="text-left py-4 px-4 font-semibold text-gray-700">
                                                <button
                                                    onClick={() => handleSort('role')}
                                                    className="flex items-center gap-1 hover:text-gray-900"
                                                >
                                                    Role
                                                    <ArrowUpDown className="w-4 h-4" />
                                                </button>
                                            </th>
                                            <th className="text-left py-4 px-4 font-semibold text-gray-700">Area/Branch</th>
                                            <th className="text-left py-4 px-4 font-semibold text-gray-700">Status</th>
                                            <th className="text-center py-4 px-4 font-semibold text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentStaffs.map((staff) => (
                                            <tr key={staff.id} className="border-b hover:bg-gray-50 transition-colors">
                                                <td className="py-4 px-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedStaffs.includes(staff.id)}
                                                        onChange={() => handleSelectStaff(staff.id)}
                                                        className="rounded border-gray-300"
                                                    />
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-semibold shadow-sm">
                                                            {staff.full_name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="font-medium text-gray-900">{staff.full_name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-gray-600">{staff.email}</td>
                                                <td className="py-4 px-4 text-gray-600">{staff.phone || '-'}</td>
                                                <td className="py-4 px-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadge(staff.role)}`}>
                                                        {getRoleLabel(staff.role)}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-gray-600 text-sm">
                                                    {staff.area_id && <div className="mb-1">📍 {getAreaName(staff.area_id)}</div>}
                                                    {staff.branch_id && <div className="text-xs text-gray-500">🏢 {getBranchName(staff.branch_id)}</div>}
                                                    {!staff.area_id && !staff.branch_id && '-'}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${staff.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                        {staff.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => handleEdit(staff)}
                                                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Edit staff"
                                                        >
                                                            <Edit className="w-4 h-4 text-blue-600" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleToggleStatus(staff)}
                                                            className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
                                                            title={staff.is_active ? 'Deactivate' : 'Activate'}
                                                        >
                                                            {staff.is_active ? (
                                                                <UserX className="w-4 h-4 text-orange-600" />
                                                            ) : (
                                                                <UserCheck className="w-4 h-4 text-green-600" />
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(staff.id)}
                                                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete staff"
                                                        >
                                                            <Trash2 className="w-4 h-4 text-red-600" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {currentStaffs.length === 0 && (
                                    <div className="text-center py-12">
                                        <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500">No staff members found</p>
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                                    <p className="text-sm text-gray-600">
                                        Showing {startIndex + 1} to {Math.min(endIndex, filteredAndSortedStaffs.length)} of {filteredAndSortedStaffs.length} results
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <GlassyButton
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                            disabled={currentPage === 1}
                                        >
                                            Previous
                                        </GlassyButton>
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                                <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                                        currentPage === page
                                                            ? 'bg-green-600 text-white'
                                                            : 'text-gray-600 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                        </div>
                                        <GlassyButton
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                            disabled={currentPage === totalPages}
                                        >
                                            Next
                                        </GlassyButton>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
                </>
            )}
        </div>
        </AdminOnly>
    )
}

// Staff Form Component
function StaffForm({
    formData,
    setFormData,
    areas,
    branches,
    onSubmit,
    onCancel,
    isEdit = false
}: {
    formData: any
    setFormData: (data: any) => void
    areas: Area[]
    branches: Branch[]
    onSubmit: () => void
    onCancel: () => void
    isEdit?: boolean
}) {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [emailValidation, setEmailValidation] = useState<{
        isValid: boolean | null
        message: string
        isChecking: boolean
    }>({ isValid: null, message: '', isChecking: false })

    // Validate email format and check if it exists
    const validateEmail = async (username: string) => {
        if (!username || username.length < 3) {
            setEmailValidation({ isValid: null, message: '', isChecking: false })
            return
        }

        // Check format first
        if (!/^[a-z0-9]+([._-]?[a-z0-9]+)*$/.test(username)) {
            setEmailValidation({ 
                isValid: false, 
                message: 'Invalid format. Use letters, numbers, and single dots/hyphens/underscores.', 
                isChecking: false 
            })
            return
        }

        if (/^[._-]|[._-]$/.test(username)) {
            setEmailValidation({ 
                isValid: false, 
                message: 'Cannot start or end with special characters.', 
                isChecking: false 
            })
            return
        }

        setEmailValidation({ isValid: null, message: '', isChecking: true })

        // Check if email exists using server action
        try {
            const result = await checkEmailAvailability(username)

            if (result.error) {
                setEmailValidation({ isValid: false, message: 'Error checking email', isChecking: false })
                return
            }

            if (result.available) {
                setEmailValidation({ 
                    isValid: true, 
                    message: 'Email is available', 
                    isChecking: false 
                })
            } else {
                setEmailValidation({ 
                    isValid: false, 
                    message: 'This email is already taken', 
                    isChecking: false 
                })
            }
        } catch (err) {
            setEmailValidation({ isValid: false, message: 'Error validating email', isChecking: false })
        }
    }

    // Debounce email validation
    useEffect(() => {
        if (isEdit) return // Don't validate on edit
        
        const timer = setTimeout(() => {
            validateEmail(formData.username)
        }, 500)

        return () => clearTimeout(timer)
    }, [formData.username, isEdit])

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="first_name">First Name *</Label>
                    <Input
                        id="first_name"
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        placeholder="Juan"
                        className="transition-all duration-200 focus:ring-2 focus:ring-green-500"
                    />
                </div>
                <div>
                    <Label htmlFor="last_name">Last Name *</Label>
                    <Input
                        id="last_name"
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        placeholder="Dela Cruz"
                        className="transition-all duration-200 focus:ring-2 focus:ring-green-500"
                    />
                </div>
            </div>
            
            <div>
                <Label htmlFor="username">Username *</Label>
                <div className="relative">
                    <Input
                        id="username"
                        type="text"
                        value={formData.username}
                        onChange={(e) => {
                            let value = e.target.value.toLowerCase()
                            // Remove invalid characters
                            value = value.replace(/[^a-z0-9._-]/g, '')
                            // Prevent consecutive special characters
                            value = value.replace(/[._-]{2,}/g, (match) => match[0])
                            // Prevent starting with special characters
                            value = value.replace(/^[._-]+/, '')
                            setFormData({ ...formData, username: value })
                        }}
                        placeholder="juan.delacruz"
                        disabled={isEdit}
                        className={`pr-36 transition-all duration-200 ${
                            isEdit 
                                ? 'bg-gray-50 cursor-not-allowed' 
                                : emailValidation.isValid === false 
                                    ? 'border-red-300 focus:ring-red-500' 
                                    : emailValidation.isValid === true 
                                        ? 'border-green-300 focus:ring-green-500' 
                                        : 'focus:ring-2 focus:ring-green-500'
                        }`}
                        maxLength={30}
                    />
                    {!isEdit && formData.username && (
                        <div className="absolute right-28 top-1/2 -translate-y-1/2">
                            {emailValidation.isChecking ? (
                                <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                            ) : emailValidation.isValid === true ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : emailValidation.isValid === false ? (
                                <XCircle className="w-4 h-4 text-red-600" />
                            ) : null}
                        </div>
                    )}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium pointer-events-none">
                        @alwan.com
                    </div>
                </div>
                {isEdit && <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>}
                {!isEdit && emailValidation.message && (
                    <p className={`text-xs mt-1 ${emailValidation.isValid === false ? 'text-red-600' : 'text-green-600'}`}>
                        {emailValidation.message}
                    </p>
                )}
                {!isEdit && !emailValidation.message && (
                    <p className="text-xs text-gray-500 mt-1">Min 3 characters. Letters, numbers, dots, hyphens, underscores (no consecutive special chars)</p>
                )}
            </div>

            <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9]/g, '') })}
                    placeholder="09123456789"
                    maxLength={11}
                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-gray-500 mt-1">Numbers only (e.g., 09123456789)</p>
            </div>

            {!isEdit && (
                <>
                    <div>
                        <Label htmlFor="password">Password *</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Minimum 6 characters"
                                className="transition-all duration-200 focus:ring-2 focus:ring-green-500 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="confirm_password">Confirm Password *</Label>
                        <div className="relative">
                            <Input
                                id="confirm_password"
                                type={showConfirmPassword ? "text" : "password"}
                                value={formData.confirm_password}
                                onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                                placeholder="Re-enter password"
                                className="transition-all duration-200 focus:ring-2 focus:ring-green-500 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>
                </>
            )}

            <div>
                <Label htmlFor="role">Role *</Label>
                <Select value={formData.role} onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}>
                    <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-green-500">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {ROLE_OPTIONS.map(role => (
                            <SelectItem key={role.value} value={role.value} className="cursor-pointer hover:bg-gray-50">
                                <div className="py-1">
                                    <div className="font-medium">{role.label}</div>
                                    <div className="text-xs text-gray-500">{role.description}</div>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {(formData.role === 'area_manager' || formData.role === 'branch_manager') && (
                <div className="animate-in slide-in-from-top duration-300">
                    <Label htmlFor="area_id">Area {formData.role === 'area_manager' ? '*' : ''}</Label>
                    <Select value={formData.area_id} onValueChange={(value) => setFormData({ ...formData, area_id: value, branch_id: '' })}>
                        <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-green-500">
                            <SelectValue placeholder="Select area" />
                        </SelectTrigger>
                        <SelectContent>
                            {areas.map(area => (
                                <SelectItem key={area.id} value={area.id} className="cursor-pointer hover:bg-gray-50">
                                    {area.name} ({area.code})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {formData.role === 'branch_manager' && formData.area_id && (
                <div className="animate-in slide-in-from-top duration-300">
                    <Label htmlFor="branch_id">Branch *</Label>
                    <Select value={formData.branch_id} onValueChange={(value) => setFormData({ ...formData, branch_id: value })}>
                        <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-green-500">
                            <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                        <SelectContent>
                            {branches.map(branch => (
                                <SelectItem key={branch.id} value={branch.id} className="cursor-pointer hover:bg-gray-50">
                                    {branch.name} ({branch.code})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            <div className="flex items-center gap-3 pt-4 border-t">
                <GlassyButton 
                    onClick={onCancel} 
                    variant="outline" 
                    className="flex-1 transition-all duration-200 hover:scale-105"
                >
                    Cancel
                </GlassyButton>
                <GlassyButton 
                    onClick={onSubmit} 
                    disabled={!isEdit && (emailValidation.isValid !== true || emailValidation.isChecking)}
                    className="flex-1 transition-all duration-200 hover:scale-105 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isEdit ? 'Update Staff' : 'Add Staff'}
                </GlassyButton>
            </div>
        </div>
    )
}
