'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GlassyButton } from '@/components/ui/glassy-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Edit, Trash2, Search, UserCheck, UserX } from 'lucide-react'
import { toast } from 'sonner'

interface User {
    id: string
    email: string
    fullName: string
    role: 'admin' | 'area_manager' | 'branch_manager' | 'field_officer'
    branchId?: string
    areaId?: string
    phone?: string
    isActive: boolean
    createdAt: string
}

const ROLES = [
    { value: 'admin', label: 'Super Admin' },
    { value: 'area_manager', label: 'Area Manager' },
    { value: 'branch_manager', label: 'Branch Manager' },
    { value: 'field_officer', label: 'Field Officer' },
]

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [roleFilter, setRoleFilter] = useState<string>('all')
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    // Mock data - replace with actual API call
    useEffect(() => {
        loadUsers()
    }, [])

    const loadUsers = async () => {
        setIsLoading(true)
        try {
            // TODO: Replace with actual API call
            const mockUsers: User[] = [
                {
                    id: '1',
                    email: 'admin@kmbi.com',
                    fullName: 'Super Admin',
                    role: 'admin',
                    phone: '+63 912 345 6789',
                    isActive: true,
                    createdAt: '2024-01-15T08:00:00Z',
                },
                {
                    id: '2',
                    email: 'area.manager@kmbi.com',
                    fullName: 'Juan Dela Cruz',
                    role: 'area_manager',
                    areaId: 'area-1',
                    phone: '+63 912 345 6790',
                    isActive: true,
                    createdAt: '2024-02-01T08:00:00Z',
                },
                {
                    id: '3',
                    email: 'branch.manager@kmbi.com',
                    fullName: 'Maria Santos',
                    role: 'branch_manager',
                    branchId: 'branch-1',
                    phone: '+63 912 345 6791',
                    isActive: true,
                    createdAt: '2024-03-10T08:00:00Z',
                },
            ]
            setUsers(mockUsers)
        } catch (error) {
            toast.error('Failed to load users')
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreateUser = () => {
        setEditingUser(null)
        setIsDialogOpen(true)
    }

    const handleEditUser = (user: User) => {
        setEditingUser(user)
        setIsDialogOpen(true)
    }

    const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
        try {
            // TODO: API call to toggle user status
            toast.success(`User ${currentStatus ? 'deactivated' : 'activated'} successfully`)
            loadUsers()
        } catch (error) {
            toast.error('Failed to update user status')
        }
    }

    const handleDeleteUser = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return
        }

        try {
            // TODO: API call to delete user
            toast.success('User deleted successfully')
            loadUsers()
        } catch (error) {
            toast.error('Failed to delete user')
        }
    }

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesRole = roleFilter === 'all' || user.role === roleFilter
        return matchesSearch && matchesRole
    })

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-purple-100 text-purple-800'
            case 'area_manager': return 'bg-blue-100 text-blue-800'
            case 'branch_manager': return 'bg-green-100 text-green-800'
            case 'field_officer': return 'bg-yellow-100 text-yellow-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-500 mt-1">Manage system users and their roles</p>
                </div>
                <GlassyButton onClick={handleCreateUser} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add User
                </GlassyButton>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                {ROLES.map(role => (
                                    <SelectItem key={role.value} value={role.value}>
                                        {role.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Users ({filteredUsers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="p-3 text-left text-sm font-semibold">Name</th>
                                    <th className="p-3 text-left text-sm font-semibold">Email</th>
                                    <th className="p-3 text-left text-sm font-semibold">Role</th>
                                    <th className="p-3 text-left text-sm font-semibold">Phone</th>
                                    <th className="p-3 text-left text-sm font-semibold">Status</th>
                                    <th className="p-3 text-right text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="p-3 text-sm font-medium">{user.fullName}</td>
                                        <td className="p-3 text-sm text-gray-600">{user.email}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                                                {ROLES.find(r => r.value === user.role)?.label}
                                            </span>
                                        </td>
                                        <td className="p-3 text-sm text-gray-600">{user.phone || '-'}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {user.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEditUser(user)}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                    title="Edit user"
                                                >
                                                    <Edit className="w-4 h-4 text-gray-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleToggleStatus(user.id, user.isActive)}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                    title={user.isActive ? 'Deactivate user' : 'Activate user'}
                                                >
                                                    {user.isActive ? (
                                                        <UserX className="w-4 h-4 text-orange-600" />
                                                    ) : (
                                                        <UserCheck className="w-4 h-4 text-green-600" />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                    title="Delete user"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-600" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredUsers.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No users found</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Create/Edit User Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingUser ? 'Edit User' : 'Create New User'}</DialogTitle>
                    </DialogHeader>
                    <UserForm
                        user={editingUser}
                        onSuccess={() => {
                            setIsDialogOpen(false)
                            loadUsers()
                        }}
                        onCancel={() => setIsDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}

// User Form Component
function UserForm({ user, onSuccess, onCancel }: {
    user: User | null
    onSuccess: () => void
    onCancel: () => void
}) {
    const [formData, setFormData] = useState({
        email: user?.email || '',
        fullName: user?.fullName || '',
        role: user?.role || 'field_officer',
        phone: user?.phone || '',
    })
    const [isSaving, setIsSaving] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        try {
            // TODO: API call to create/update user
            await new Promise(resolve => setTimeout(resolve, 1000))
            toast.success(user ? 'User updated successfully' : 'User created successfully')
            onSuccess()
        } catch (error) {
            toast.error('Failed to save user')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                />
            </div>
            <div>
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />
            </div>
            <div>
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(value: any) => setFormData({ ...formData, role: value })}>
                    <SelectTrigger id="role">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {ROLES.map(role => (
                            <SelectItem key={role.value} value={role.value}>
                                {role.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <GlassyButton type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </GlassyButton>
                <GlassyButton type="submit" isLoading={isSaving} loadingText="Saving...">
                    {user ? 'Update User' : 'Create User'}
                </GlassyButton>
            </div>
        </form>
    )
}
