'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GlassyButton } from '@/components/ui/glassy-button'
import { Search, Download, Filter, ArrowUpDown, RefreshCw, Eye, Calendar, Database, Activity } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { getAuditLogs } from '@/app/actions/audit'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { AdminOnly } from '@/components/auth/PermissionGate'

type AuditLog = {
    id: string
    user_id: string
    user_email: string
    user_role: string
    action: string
    resource_type: string
    resource_id: string
    old_values: any
    new_values: any
    ip_address: string | null
    user_agent: string | null
    success: boolean
    created_at: string
}
type SupabaseAuditLog = {
    id: string
    instance_id: string
    payload: {
        timestamp: string
        action: string
        actor_id: string
        actor_username?: string
        actor_via_sso: boolean
        log_type: string
        traits?: any
    }
    created_at: string
}

type SortField = 'created_at' | 'action' | 'user_email' | 'resource_type'
type SortOrder = 'asc' | 'desc'
type TabType = 'custom' | 'system'

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
    create: { label: 'Created', color: 'bg-green-100 text-green-700' },
    update: { label: 'Updated', color: 'bg-blue-100 text-blue-700' },
    delete: { label: 'Deleted', color: 'bg-red-100 text-red-700' },
    activate: { label: 'Activated', color: 'bg-emerald-100 text-emerald-700' },
    deactivate: { label: 'Deactivated', color: 'bg-orange-100 text-orange-700' },
    bulk_deactivate: { label: 'Bulk Deactivated', color: 'bg-red-100 text-red-700' },
}

const RESOURCE_LABELS: Record<string, string> = {
    staff: 'Staff',
    profile: 'Profile',
    user: 'User',
    member: 'Member',
    center: 'Center',
    loan: 'Loan',
}

export default function AuditLogsPage() {
    const [activeTab, setActiveTab] = useState<TabType>('custom')
    const [logs, setLogs] = useState<AuditLog[]>([])
    const [systemLogs, setSystemLogs] = useState<SupabaseAuditLog[]>([])
    const [totalLogs, setTotalLogs] = useState(0)
    const [totalSystemLogs, setTotalSystemLogs] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [actionFilter, setActionFilter] = useState('all')
    const [resourceFilter, setResourceFilter] = useState('all')
    const [dateFilter, setDateFilter] = useState('all')
    const [sortField, setSortField] = useState<SortField>('created_at')
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(20)
    const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
    const [selectedSystemLog, setSelectedSystemLog] = useState<SupabaseAuditLog | null>(null)

    useEffect(() => {
        if (activeTab === 'custom') {
            loadLogs()
        } else {
            loadSystemLogs()
        }
    }, [currentPage, actionFilter, resourceFilter, dateFilter, activeTab])

    const loadSystemLogs = async () => {
        setIsLoading(true)
        try {
            const supabase = createClient()
            if (!supabase) {
                toast.error('Failed to initialize Supabase client')
                return
            }

            const { data, error, count } = await supabase
                .from('audit_log_entries')
                .select('*', { count: 'exact' })
                .order('created_at', { ascending: false })
                .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1)

            if (error) throw error

            setSystemLogs(data || [])
            setTotalSystemLogs(count || 0)
        } catch (error) {
            console.error('Error loading system logs:', error)
            toast.error('Failed to load system audit logs')
        } finally {
            setIsLoading(false)
        }
    }

    const loadLogs = async () => {
        setIsLoading(true)
        try {
            const startDate = getStartDate(dateFilter)
            
            const { logs: data, total } = await getAuditLogs({
                action: actionFilter !== 'all' ? actionFilter : undefined,
                resourceType: resourceFilter !== 'all' ? resourceFilter : undefined,
                startDate,
                limit: itemsPerPage,
                offset: (currentPage - 1) * itemsPerPage
            })

            setLogs(data)
            setTotalLogs(total)
        } catch (error) {
            console.error('Error loading logs:', error)
            toast.error('Failed to load audit logs')
        } finally {
            setIsLoading(false)
        }
    }

    const getStartDate = (filter: string) => {
        const now = new Date()
        switch (filter) {
            case 'today':
                return new Date(now.setHours(0, 0, 0, 0)).toISOString()
            case 'week':
                return new Date(now.setDate(now.getDate() - 7)).toISOString()
            case 'month':
                return new Date(now.setMonth(now.getMonth() - 1)).toISOString()
            case 'year':
                return new Date(now.setFullYear(now.getFullYear() - 1)).toISOString()
            default:
                return undefined
        }
    }

    const filteredAndSortedLogs = logs
        .filter(log => {
            const matchesSearch = 
                log.user_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.resource_id.toLowerCase().includes(searchQuery.toLowerCase())
            return matchesSearch
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

    const filteredSystemLogs = systemLogs.filter(log => {
        const matchesSearch = 
            log.payload?.actor_username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.payload?.action?.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesSearch
    })

    const totalPages = activeTab === 'custom' 
        ? Math.ceil(totalLogs / itemsPerPage)
        : Math.ceil(totalSystemLogs / itemsPerPage)

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortOrder('asc')
        }
    }

    const exportToCSV = () => {
        if (activeTab === 'custom') {
            const headers = ['Date', 'User', 'Role', 'Action', 'Resource Type', 'Resource ID', 'IP Address']
            const rows = filteredAndSortedLogs.map(log => [
                format(new Date(log.created_at), 'yyyy-MM-dd HH:mm:ss'),
                log.user_email,
                log.user_role,
                log.action,
                log.resource_type,
                log.resource_id,
                log.ip_address || '-'
            ])

            const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
            const blob = new Blob([csv], { type: 'text/csv' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `custom-audit-logs-${new Date().toISOString().split('T')[0]}.csv`
            a.click()
        } else {
            const headers = ['Date', 'Action', 'Actor ID', 'Actor Username', 'Log Type']
            const rows = filteredSystemLogs.map(log => [
                format(new Date(log.created_at), 'yyyy-MM-dd HH:mm:ss'),
                log.payload?.action || '-',
                log.payload?.actor_id || '-',
                log.payload?.actor_username || '-',
                log.payload?.log_type || '-'
            ])

            const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
            const blob = new Blob([csv], { type: 'text/csv' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `system-audit-logs-${new Date().toISOString().split('T')[0]}.csv`
            a.click()
        }
        toast.success('Audit logs exported successfully')
    }

    const getActionBadge = (action: string) => {
        const config = ACTION_LABELS[action] || { label: action, color: 'bg-gray-100 text-gray-700' }
        return config
    }

    const getResourceLabel = (type: string) => {
        return RESOURCE_LABELS[type] || type
    }

    return (
        <AdminOnly>
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
                    <p className="text-gray-500 mt-1">Track all system activities and changes</p>
                </div>
                <div className="flex items-center gap-3">
                    <GlassyButton variant="outline" onClick={loadLogs} className="gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </GlassyButton>
                    <GlassyButton variant="outline" onClick={exportToCSV} className="gap-2">
                        <Download className="w-4 h-4" />
                        Export CSV
                    </GlassyButton>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-1">Total Logs</p>
                            <p className="text-3xl font-bold text-gray-900">
                                {activeTab === 'custom' ? totalLogs : totalSystemLogs}
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-1">Today</p>
                            <p className="text-3xl font-bold text-blue-600">
                                {activeTab === 'custom' 
                                    ? logs.filter(l => new Date(l.created_at).toDateString() === new Date().toDateString()).length
                                    : systemLogs.filter(l => new Date(l.created_at).toDateString() === new Date().toDateString()).length
                                }
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-1">This Week</p>
                            <p className="text-3xl font-bold text-green-600">
                                {activeTab === 'custom' 
                                    ? logs.filter(l => {
                                        const logDate = new Date(l.created_at)
                                        const weekAgo = new Date()
                                        weekAgo.setDate(weekAgo.getDate() - 7)
                                        return logDate >= weekAgo
                                    }).length
                                    : systemLogs.filter(l => {
                                        const logDate = new Date(l.created_at)
                                        const weekAgo = new Date()
                                        weekAgo.setDate(weekAgo.getDate() - 7)
                                        return logDate >= weekAgo
                                    }).length
                                }
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-1">{activeTab === 'custom' ? 'Staff Actions' : 'Auth Events'}</p>
                            <p className="text-3xl font-bold text-purple-600">
                                {activeTab === 'custom' 
                                    ? logs.filter(l => l.resource_type === 'staff' || l.resource_type === 'profile').length
                                    : systemLogs.filter(l => l.payload?.log_type === 'account').length
                                }
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-2 border-b">
                        <button
                            onClick={() => {
                                setActiveTab('custom')
                                setCurrentPage(1)
                            }}
                            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
                                activeTab === 'custom'
                                    ? 'border-green-600 text-green-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <Activity className="w-4 h-4" />
                            Custom Audit Logs
                            <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">
                                {totalLogs}
                            </span>
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('system')
                                setCurrentPage(1)
                            }}
                            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
                                activeTab === 'system'
                                    ? 'border-green-600 text-green-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <Database className="w-4 h-4" />
                            Supabase System Logs
                            <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">
                                {totalSystemLogs}
                            </span>
                        </button>
                    </div>
                </CardContent>
            </Card>

            {/* Filters */}
            {activeTab === 'custom' && (
                <Card>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="relative md:col-span-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Search by user or ID..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Select value={actionFilter} onValueChange={(value) => {
                                setActionFilter(value)
                                setCurrentPage(1)
                            }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by action" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Actions</SelectItem>
                                    <SelectItem value="create">Created</SelectItem>
                                    <SelectItem value="update">Updated</SelectItem>
                                    <SelectItem value="delete">Deleted</SelectItem>
                                    <SelectItem value="activate">Activated</SelectItem>
                                    <SelectItem value="deactivate">Deactivated</SelectItem>
                                    <SelectItem value="bulk_deactivate">Bulk Deactivated</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={resourceFilter} onValueChange={(value) => {
                                setResourceFilter(value)
                                setCurrentPage(1)
                            }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by resource" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Resources</SelectItem>
                                    <SelectItem value="staff">Staff</SelectItem>
                                    <SelectItem value="profile">Profile</SelectItem>
                                    <SelectItem value="member">Member</SelectItem>
                                    <SelectItem value="center">Center</SelectItem>
                                    <SelectItem value="loan">Loan</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={dateFilter} onValueChange={(value) => {
                                setDateFilter(value)
                                setCurrentPage(1)
                            }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by date" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Time</SelectItem>
                                    <SelectItem value="today">Today</SelectItem>
                                    <SelectItem value="week">Last 7 Days</SelectItem>
                                    <SelectItem value="month">Last 30 Days</SelectItem>
                                    <SelectItem value="year">Last Year</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            )}

            {activeTab === 'system' && (
                <Card>
                    <CardContent className="pt-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search by action or username..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Logs Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Activity Logs ({totalLogs})</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                            <p className="text-gray-500">Loading audit logs...</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b bg-gray-50">
                                            <th className="text-left py-4 px-4 font-semibold text-gray-700">
                                                <button
                                                    onClick={() => handleSort('created_at')}
                                                    className="flex items-center gap-1 hover:text-gray-900"
                                                >
                                                    Timestamp
                                                    <ArrowUpDown className="w-4 h-4" />
                                                </button>
                                            </th>
                                            <th className="text-left py-4 px-4 font-semibold text-gray-700">
                                                <button
                                                    onClick={() => handleSort('user_email')}
                                                    className="flex items-center gap-1 hover:text-gray-900"
                                                >
                                                    User
                                                    <ArrowUpDown className="w-4 h-4" />
                                                </button>
                                            </th>
                                            <th className="text-left py-4 px-4 font-semibold text-gray-700">
                                                <button
                                                    onClick={() => handleSort('action')}
                                                    className="flex items-center gap-1 hover:text-gray-900"
                                                >
                                                    Action
                                                    <ArrowUpDown className="w-4 h-4" />
                                                </button>
                                            </th>
                                            <th className="text-left py-4 px-4 font-semibold text-gray-700">
                                                <button
                                                    onClick={() => handleSort('resource_type')}
                                                    className="flex items-center gap-1 hover:text-gray-900"
                                                >
                                                    Resource
                                                    <ArrowUpDown className="w-4 h-4" />
                                                </button>
                                            </th>
                                            <th className="text-left py-4 px-4 font-semibold text-gray-700">Resource ID</th>
                                            <th className="text-left py-4 px-4 font-semibold text-gray-700">IP Address</th>
                                            <th className="text-center py-4 px-4 font-semibold text-gray-700">Details</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredAndSortedLogs.map((log) => {
                                            const actionConfig = getActionBadge(log.action)
                                            return (
                                                <tr key={log.id} className="border-b hover:bg-gray-50 transition-colors">
                                                    <td className="py-4 px-4 text-sm text-gray-600">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4 text-gray-400" />
                                                            <div>
                                                                <div>{format(new Date(log.created_at), 'MMM dd, yyyy')}</div>
                                                                <div className="text-xs text-gray-500">
                                                                    {format(new Date(log.created_at), 'HH:mm:ss')}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div>
                                                            <div className="font-medium text-gray-900">{log.user_email}</div>
                                                            <div className="text-xs text-gray-500 capitalize">{log.user_role?.replace('_', ' ')}</div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${actionConfig.color}`}>
                                                            {actionConfig.label}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className="text-sm font-medium text-gray-700">
                                                            {getResourceLabel(log.resource_type)}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 text-sm text-gray-600 font-mono">
                                                        {log.resource_id.substring(0, 8)}...
                                                    </td>
                                                    <td className="py-4 px-4 text-sm text-gray-600">
                                                        {log.ip_address || '-'}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center justify-center">
                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <button
                                                                        onClick={() => setSelectedLog(log)}
                                                                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                                                        title="View details"
                                                                    >
                                                                        <Eye className="w-4 h-4 text-blue-600" />
                                                                    </button>
                                                                </DialogTrigger>
                                                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                                                    <DialogHeader>
                                                                        <DialogTitle>Audit Log Details</DialogTitle>
                                                                    </DialogHeader>
                                                                    {selectedLog && (
                                                                        <div className="space-y-4">
                                                                            <div className="grid grid-cols-2 gap-4">
                                                                                <div>
                                                                                    <p className="text-sm font-semibold text-gray-700">Timestamp</p>
                                                                                    <p className="text-sm text-gray-600">
                                                                                        {format(new Date(selectedLog.created_at), 'PPpp')}
                                                                                    </p>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-sm font-semibold text-gray-700">User</p>
                                                                                    <p className="text-sm text-gray-600">{selectedLog.user_email}</p>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-sm font-semibold text-gray-700">Action</p>
                                                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionBadge(selectedLog.action).color}`}>
                                                                                        {getActionBadge(selectedLog.action).label}
                                                                                    </span>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-sm font-semibold text-gray-700">Resource Type</p>
                                                                                    <p className="text-sm text-gray-600">{getResourceLabel(selectedLog.resource_type)}</p>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-sm font-semibold text-gray-700">Resource ID</p>
                                                                                    <p className="text-sm text-gray-600 font-mono">{selectedLog.resource_id}</p>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-sm font-semibold text-gray-700">IP Address</p>
                                                                                    <p className="text-sm text-gray-600">{selectedLog.ip_address || 'N/A'}</p>
                                                                                </div>
                                                                            </div>
                                                                            
                                                                            {selectedLog.old_values && (
                                                                                <div>
                                                                                    <p className="text-sm font-semibold text-gray-700 mb-2">Old Values</p>
                                                                                    <pre className="bg-gray-50 p-3 rounded-lg text-xs overflow-x-auto">
                                                                                        {JSON.stringify(selectedLog.old_values, null, 2)}
                                                                                    </pre>
                                                                                </div>
                                                                            )}
                                                                            
                                                                            {selectedLog.new_values && (
                                                                                <div>
                                                                                    <p className="text-sm font-semibold text-gray-700 mb-2">New Values</p>
                                                                                    <pre className="bg-gray-50 p-3 rounded-lg text-xs overflow-x-auto">
                                                                                        {JSON.stringify(selectedLog.new_values, null, 2)}
                                                                                    </pre>
                                                                                </div>
                                                                            )}
                                                                            
                                                                            {selectedLog.user_agent && (
                                                                                <div>
                                                                                    <p className="text-sm font-semibold text-gray-700 mb-2">User Agent</p>
                                                                                    <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg break-all">
                                                                                        {selectedLog.user_agent}
                                                                                    </p>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </DialogContent>
                                                            </Dialog>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                                {filteredAndSortedLogs.length === 0 && (
                                    <div className="text-center py-12">
                                        <Filter className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500">No audit logs found</p>
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                                    <p className="text-sm text-gray-600">
                                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalLogs)} of {totalLogs} results
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
                                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                let pageNum
                                                if (totalPages <= 5) {
                                                    pageNum = i + 1
                                                } else if (currentPage <= 3) {
                                                    pageNum = i + 1
                                                } else if (currentPage >= totalPages - 2) {
                                                    pageNum = totalPages - 4 + i
                                                } else {
                                                    pageNum = currentPage - 2 + i
                                                }
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => setCurrentPage(pageNum)}
                                                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                                            currentPage === pageNum
                                                                ? 'bg-green-600 text-white'
                                                                : 'text-gray-600 hover:bg-gray-100'
                                                        }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                )
                                            })}
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
        </div>
        </AdminOnly>
    )
}
