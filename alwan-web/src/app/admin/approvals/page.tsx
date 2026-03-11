'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, FileText, CheckCircle, XCircle, Eye, User, Building2, MapPin, Phone, Mail, Calendar, X, RefreshCw, Download, Filter, Printer, Keyboard } from 'lucide-react'
import { toast } from 'sonner'
import { getKYCApplications, getActiveCenters, approveKYCWithCenter, rejectKYC, type KYCApplication } from '@/app/actions/kyc-approvals'
import { getApprovalStatistics } from '@/app/actions/approval-statistics'
import { logAuditTrail, getAuditTrail } from '@/app/actions/audit-trail'
import { addApplicationNote, getApplicationNotes } from '@/app/actions/approval-notes'
import Image from 'next/image'
import { ApprovalsSkeleton } from '@/components/admin/ApprovalsSkeleton'
import { StatisticsDashboard } from '@/components/admin/approvals/StatisticsDashboard'
import { AdvancedFilters } from '@/components/admin/approvals/AdvancedFilters'
import { BulkActionsBar } from '@/components/admin/approvals/BulkActionsBar'
import { ApplicationCard } from '@/components/admin/approvals/ApplicationCard'
import { RiskScoreDisplay } from '@/components/admin/approvals/RiskScoreDisplay'
import { KeyboardShortcutsHelp } from '@/components/admin/approvals/KeyboardShortcutsHelp'
import { useKeyboardShortcuts, type KeyboardShortcut } from '@/hooks/useKeyboardShortcuts'
import { exportToCSV, exportToExcel } from '@/lib/utils/export'
import { printApplication } from '@/lib/utils/print'
import { calculateRiskScore } from '@/lib/utils/risk-scoring'
import { ApprovalStatistics, AdvancedFilters as AdvancedFiltersType, ApplicationNote, AuditTrailEntry } from '@/types/approvals'

interface Center {
  id: string
  name: string
  code: string
  meeting_location: string
  meeting_day: string
  meeting_time: string
  branch: { name: string } | null
}

export default function ApprovalsPage() {
  // Existing state
  const [applications, setApplications] = useState<KYCApplication[]>([])
  const [filteredApplications, setFilteredApplications] = useState<KYCApplication[]>([])
  const [centers, setCenters] = useState<Center[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [selectedApplication, setSelectedApplication] = useState<KYCApplication | null>(null)
  const [showApproveModal, setShowApproveModal] = useState<string | null>(null)
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null)
  const [selectedCenter, setSelectedCenter] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [sortBy, setSortBy] = useState<'submitted_at' | 'created_at'>('submitted_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // New state for enterprise features
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFiltersType>({})
  const [statistics, setStatistics] = useState<ApprovalStatistics | null>(null)
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false)
  const [applicationNotes, setApplicationNotes] = useState<ApplicationNote[]>([])
  const [auditTrail, setAuditTrail] = useState<AuditTrailEntry[]>([])
  const [newNote, setNewNote] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterApplications()
  }, [applications, searchQuery, activeTab, advancedFilters])

  useEffect(() => {
    const pendingCount = applications.filter(a => a.status === 'pending' || a.status === 'in_review').length
    if (pendingCount > 0) {
      document.title = `(${pendingCount}) Approvals | Admin`
    } else {
      document.title = 'Approvals | Admin'
    }
  }, [applications])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [appsResult, centersResult, statsResult] = await Promise.all([
        getKYCApplications({ status: 'all', sortBy, sortOrder }),
        getActiveCenters(),
        getApprovalStatistics()
      ])
      
      if (appsResult.error) {
        toast.error(appsResult.error)
      } else {
        setApplications(appsResult.applications)
      }

      if (centersResult.error) {
        toast.error(centersResult.error)
      } else {
        setCenters(centersResult.centers as Center[])
      }
      
      if (statsResult.statistics) {
        setStatistics(statsResult.statistics)
      }
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }

  const filterApplications = () => {
    let filtered = applications

    if (activeTab !== 'all') {
      filtered = filtered.filter(app => app.status === activeTab)
    }

    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      filtered = filtered.filter(app => {
        if (!app.metadata) return false
        const metadata = app.metadata
        const fullName = `${metadata.firstName || ''} ${metadata.middleName || ''} ${metadata.lastName || ''}`.toLowerCase()
        const phone = app.mobile_number?.toLowerCase() || ''
        const business = metadata.business?.businessName?.toLowerCase() || ''
        return fullName.includes(searchLower) || phone.includes(searchLower) || business.includes(searchLower)
      })
    }

    // Apply advanced filters
    if (advancedFilters.dateRange?.start || advancedFilters.dateRange?.end) {
      filtered = filtered.filter(app => {
        if (!app.submitted_at) return false
        const date = new Date(app.submitted_at)
        if (advancedFilters.dateRange?.start && date < new Date(advancedFilters.dateRange.start)) return false
        if (advancedFilters.dateRange?.end && date > new Date(advancedFilters.dateRange.end)) return false
        return true
      })
    }

    if (advancedFilters.cities && advancedFilters.cities.length > 0) {
      filtered = filtered.filter(app => advancedFilters.cities?.includes(app.metadata?.address?.city))
    }

    if (advancedFilters.provinces && advancedFilters.provinces.length > 0) {
      filtered = filtered.filter(app => advancedFilters.provinces?.includes(app.metadata?.address?.province))
    }

    if (advancedFilters.businessTypes && advancedFilters.businessTypes.length > 0) {
      filtered = filtered.filter(app => advancedFilters.businessTypes?.includes(app.metadata?.business?.businessType))
    }

    if (advancedFilters.riskLevel && advancedFilters.riskLevel.length > 0) {
      filtered = filtered.filter(app => {
        const riskScore = calculateRiskScore(app)
        return advancedFilters.riskLevel?.includes(riskScore.level)
      })
    }

    setFilteredApplications(filtered)
  }

  const handleSelectApplication = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(appId => appId !== id) : [...prev, id])
  }

  const handleBulkApprove = () => {
    if (selectedIds.length === 0) return
    toast.info(`Bulk approve ${selectedIds.length} applications - Feature coming soon`)
  }

  const handleBulkReject = () => {
    if (selectedIds.length === 0) return
    toast.info(`Bulk reject ${selectedIds.length} applications - Feature coming soon`)
  }

  const handleExportCSV = () => {
    try {
      exportToCSV(filteredApplications)
      toast.success('Exported to CSV successfully')
    } catch (error) {
      toast.error('Failed to export')
    }
  }

  const handleExportExcel = () => {
    try {
      exportToExcel(filteredApplications)
      toast.success('Exported to Excel successfully')
    } catch (error) {
      toast.error('Failed to export')
    }
  }

  const handlePrint = (application: KYCApplication) => {
    printApplication(application)
  }

  const loadNotesAndAudit = async (applicationId: string) => {
    const [notesResult, auditResult] = await Promise.all([
      getApplicationNotes(applicationId),
      getAuditTrail(applicationId)
    ])
    if (notesResult.notes) setApplicationNotes(notesResult.notes)
    if (auditResult.entries) setAuditTrail(auditResult.entries)
  }

  const handleAddNote = async (applicationId: string) => {
    if (!newNote.trim()) return
    const result = await addApplicationNote({
      applicationId,
      note: newNote,
      adminId: 'admin-user-id',
      adminName: 'Admin User'
    })
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Note added')
      setNewNote('')
      loadNotesAndAudit(applicationId)
    }
  }

  const handleApprove = async (applicationId: string) => {
    if (!selectedCenter) {
      toast.error('Please select a center')
      return
    }
    try {
      const result = await approveKYCWithCenter({
        kycApplicationId: applicationId,
        centerId: selectedCenter,
        approvedBy: 'admin-user-id',
      })
      if (result.error) {
        toast.error(result.error)
        return
      }
      await logAuditTrail({
        applicationId,
        action: 'approved',
        performedBy: 'admin-user-id',
        performedByName: 'Admin User',
        details: `Approved and assigned to center ${selectedCenter}`
      })
      toast.success('Application approved and member created!')
      loadData()
      setShowApproveModal(null)
      setSelectedCenter('')
      setSelectedApplication(null)
    } catch (error) {
      console.error('Error approving application:', error)
      toast.error('Failed to approve application')
    }
  }

  const handleReject = async (applicationId: string) => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }
    try {
      const result = await rejectKYC({
        kycApplicationId: applicationId,
        rejectionReason,
        rejectedBy: 'admin-user-id',
      })
      if (result.error) {
        toast.error(result.error)
        return
      }
      await logAuditTrail({
        applicationId,
        action: 'rejected',
        performedBy: 'admin-user-id',
        performedByName: 'Admin User',
        details: `Rejected: ${rejectionReason}`
      })
      toast.success('Application rejected')
      loadData()
      setShowRejectModal(null)
      setRejectionReason('')
      setSelectedApplication(null)
    } catch (error) {
      console.error('Error rejecting application:', error)
      toast.error('Failed to reject application')
    }
  }

  // Keyboard shortcuts
  const shortcuts: KeyboardShortcut[] = [
    { key: 'a', action: () => handleBulkApprove(), description: 'Approve selected applications' },
    { key: 'r', action: () => handleBulkReject(), description: 'Reject selected applications' },
    { key: 'f', ctrl: true, action: () => setShowAdvancedFilters(true), description: 'Open advanced filters' },
    { key: 'e', ctrl: true, action: () => handleExportCSV(), description: 'Export to CSV' },
    { key: 'p', ctrl: true, action: () => selectedApplication && handlePrint(selectedApplication), description: 'Print current application' },
    { key: '?', action: () => setShowKeyboardHelp(true), description: 'Show keyboard shortcuts' },
    { key: 'Escape', action: () => {
      setSelectedApplication(null)
      setShowApproveModal(null)
      setShowRejectModal(null)
      setShowAdvancedFilters(false)
      setShowKeyboardHelp(false)
    }, description: 'Close modals' },
  ]

  useKeyboardShortcuts(shortcuts, true)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {isLoading ? (
        <ApprovalsSkeleton />
      ) : (
        <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Approvals</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Review and approve member applications</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setShowAdvancedFilters(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors duration-200"
                title="Advanced Filters (Ctrl+F)"
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
              </button>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors duration-200"
                title="Export CSV (Ctrl+E)"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">CSV</span>
              </button>
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors duration-200"
                title="Export Excel"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Excel</span>
              </button>
              <button
                onClick={() => setShowKeyboardHelp(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors duration-200"
                title="Keyboard Shortcuts (?)"
              >
                <Keyboard className="w-4 h-4" />
              </button>
              <button
                onClick={loadData}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors duration-200"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          <StatisticsDashboard statistics={statistics} isLoading={isLoading} />

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, phone, or business..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'submitted_at' | 'created_at')}
                    className="px-3 py-2 border rounded-lg text-sm"
                  >
                    <option value="submitted_at">Sort by Submitted</option>
                    <option value="created_at">Sort by Created</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50 transition-colors duration-300 ease-in-out"
                  >
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="relative">
            <div className="relative">
              <TabsList className="grid grid-cols-2 sm:grid-cols-5 w-full sm:w-auto bg-white border border-gray-200 p-1 rounded-lg relative">
                <div 
                  className="absolute top-1 bottom-1 bg-green-600 rounded-md transition-all duration-300 ease-in-out"
                  style={{
                    left: `${
                      activeTab === 'pending' ? '0.25rem' :
                      activeTab === 'in_review' ? 'calc(20% + 0.25rem)' :
                      activeTab === 'approved' ? 'calc(40% + 0.25rem)' :
                      activeTab === 'rejected' ? 'calc(60% + 0.25rem)' :
                      'calc(80% + 0.25rem)'
                    }`,
                    width: 'calc(20% - 0.5rem)'
                  }}
                />
                <TabsTrigger value="pending" className="text-xs sm:text-sm relative z-10 data-[state=active]:text-white data-[state=active]:bg-transparent">
                  Pending ({applications.filter(a => a.status === 'pending').length})
                </TabsTrigger>
                <TabsTrigger value="in_review" className="text-xs sm:text-sm relative z-10 data-[state=active]:text-white data-[state=active]:bg-transparent">
                  In Review ({applications.filter(a => a.status === 'in_review').length})
                </TabsTrigger>
                <TabsTrigger value="approved" className="text-xs sm:text-sm relative z-10 data-[state=active]:text-white data-[state=active]:bg-transparent">
                  Approved ({applications.filter(a => a.status === 'approved').length})
                </TabsTrigger>
                <TabsTrigger value="rejected" className="text-xs sm:text-sm relative z-10 data-[state=active]:text-white data-[state=active]:bg-transparent">
                  Rejected ({applications.filter(a => a.status === 'rejected').length})
                </TabsTrigger>
                <TabsTrigger value="all" className="text-xs sm:text-sm col-span-2 sm:col-span-1 relative z-10 data-[state=active]:text-white data-[state=active]:bg-transparent">
                  All ({applications.length})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="mt-4 sm:mt-6 animate-in fade-in-50 duration-300">
              {filteredApplications.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-gray-600">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No applications found</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {filteredApplications.map((app) => (
                    <ApplicationCard
                      key={app.id}
                      application={app}
                      isSelected={selectedIds.includes(app.id)}
                      onSelect={handleSelectApplication}
                      onView={() => {
                        setSelectedApplication(app)
                        loadNotesAndAudit(app.id)
                        logAuditTrail({
                          applicationId: app.id,
                          action: 'viewed',
                          performedBy: 'admin-user-id',
                          performedByName: 'Admin User',
                          details: 'Viewed application details'
                        })
                      }}
                      onApprove={() => setShowApproveModal(app.id)}
                      onReject={() => setShowRejectModal(app.id)}
                      showCheckbox={true}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <BulkActionsBar
            selectedCount={selectedIds.length}
            onApproveSelected={handleBulkApprove}
            onRejectSelected={handleBulkReject}
            onClearSelection={() => setSelectedIds([])}
          />

          {showAdvancedFilters && (
            <AdvancedFilters
              filters={advancedFilters}
              onFiltersChange={(filters) => {
                setAdvancedFilters(filters)
              }}
              onClose={() => setShowAdvancedFilters(false)}
            />
          )}

          {showKeyboardHelp && (
            <KeyboardShortcutsHelp
              shortcuts={shortcuts}
              onClose={() => setShowKeyboardHelp(false)}
            />
          )}

          {selectedApplication && selectedApplication.metadata && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
              <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden my-8">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b sticky top-0 bg-white z-10">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                      {selectedApplication.metadata.firstName} {selectedApplication.metadata.middleName} {selectedApplication.metadata.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{selectedApplication.mobile_number}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePrint(selectedApplication)}
                      className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors duration-200"
                      title="Print (Ctrl+P)"
                    >
                      <Printer className="w-4 h-4" />
                      <span className="hidden sm:inline">Print</span>
                    </button>
                    <button
                      onClick={() => setSelectedApplication(null)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-300 ease-in-out"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                <div className="p-4 sm:p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-600">Date of Birth:</span>
                          <span className="text-gray-900 ml-2">{selectedApplication.metadata.dateOfBirth}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Gender:</span>
                          <span className="text-gray-900 ml-2 capitalize">{selectedApplication.metadata.gender}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Civil Status:</span>
                          <span className="text-gray-900 ml-2 capitalize">{selectedApplication.metadata.civilStatus}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Nationality:</span>
                          <span className="text-gray-900 ml-2">{selectedApplication.metadata.nationality}</span>
                        </div>
                      </div>
                    </div>
                    <RiskScoreDisplay riskScore={calculateRiskScore(selectedApplication)} />
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Address</h4>
                    <p className="text-gray-900 text-sm">
                      {selectedApplication.metadata.address.houseNumber} {selectedApplication.metadata.address.street}, {selectedApplication.metadata.address.barangay}, {selectedApplication.metadata.address.city}, {selectedApplication.metadata.address.province} {selectedApplication.metadata.address.zipCode}
                    </p>
                    <p className="text-gray-600 text-sm mt-2">
                      Housing: <span className="text-gray-900 capitalize">
                        {selectedApplication.metadata.address.housingType.split('_').join(' ')}
                      </span>
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Business Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Business Name:</span>
                        <span className="text-gray-900 ml-2">{selectedApplication.metadata.business.businessName}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Business Type:</span>
                        <span className="text-gray-900 ml-2">{selectedApplication.metadata.business.businessType}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Years Operating:</span>
                        <span className="text-gray-900 ml-2">
                          {selectedApplication.metadata.business.yearsOperating.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Monthly Revenue:</span>
                        <span className="text-gray-900 ml-2">
                          ₱{selectedApplication.metadata.business.monthlyRevenue.split('_').join(' - ₱')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Financial Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Monthly Income:</span>
                        <span className="text-gray-900 ml-2">
                          ₱{selectedApplication.metadata.financial.monthlyIncome.split('_').join(' - ₱')}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Monthly Expenses:</span>
                        <span className="text-gray-900 ml-2">
                          ₱{selectedApplication.metadata.financial.monthlyExpenses.split('_').join(' - ₱')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Identity Verification</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
                      <div>
                        <span className="text-gray-600">ID Type:</span>
                        <span className="text-gray-900 ml-2 capitalize">
                          {selectedApplication.metadata.identity.idType.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">ID Number:</span>
                        <span className="text-gray-900 ml-2">{selectedApplication.metadata.identity.idNumber}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Face Match Score:</span>
                        <span className={`ml-2 font-semibold ${
                          selectedApplication.metadata.identity.faceMatchScore >= 0.7 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {(selectedApplication.metadata.identity.faceMatchScore * 100).toFixed(1)}%
                          {selectedApplication.metadata.identity.faceMatchScore >= 0.7 ? ' ✓' : ' ✗'}
                        </span>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-900 mb-3">Verification Checklist</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <input type="checkbox" id="check-id-match" className="mt-1" />
                          <label htmlFor="check-id-match" className="text-gray-700">
                            ID number matches the ID document shown in images
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <input type="checkbox" id="check-face-match" className="mt-1" />
                          <label htmlFor="check-face-match" className="text-gray-700">
                            Face in selfie matches face in ID document
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <input type="checkbox" id="check-id-valid" className="mt-1" />
                          <label htmlFor="check-id-valid" className="text-gray-700">
                            ID document appears valid and not expired
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <input type="checkbox" id="check-clear" className="mt-1" />
                          <label htmlFor="check-clear" className="text-gray-700">
                            All images are clear and readable
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <input type="checkbox" id="check-name" className="mt-1" />
                          <label htmlFor="check-name" className="text-gray-700">
                            Name on ID matches application name
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedApplication.metadata.identity.idFrontUrl && (
                        <div className="group relative">
                          <p className="text-gray-600 text-xs font-medium mb-2">ID Front</p>
                          <div className="relative overflow-hidden rounded-lg border-2 border-gray-200 hover:border-green-500 transition-colors duration-200">
                            <Image
                              src={selectedApplication.metadata.identity.idFrontUrl}
                              alt="ID Front"
                              width={400}
                              height={300}
                              className="w-full h-auto object-cover"
                              unoptimized
                            />
                            <a
                              href={selectedApplication.metadata.identity.idFrontUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                            >
                              <span className="text-white font-medium">View Full Size</span>
                            </a>
                          </div>
                        </div>
                      )}
                      {selectedApplication.metadata.identity.idBackUrl && (
                        <div className="group relative">
                          <p className="text-gray-600 text-xs font-medium mb-2">ID Back</p>
                          <div className="relative overflow-hidden rounded-lg border-2 border-gray-200 hover:border-green-500 transition-colors duration-200">
                            <Image
                              src={selectedApplication.metadata.identity.idBackUrl}
                              alt="ID Back"
                              width={400}
                              height={300}
                              className="w-full h-auto object-cover"
                              unoptimized
                            />
                            <a
                              href={selectedApplication.metadata.identity.idBackUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                            >
                              <span className="text-white font-medium">View Full Size</span>
                            </a>
                          </div>
                        </div>
                      )}
                      {selectedApplication.metadata.identity.selfieUrl && (
                        <div className="group relative">
                          <p className="text-gray-600 text-xs font-medium mb-2">Selfie</p>
                          <div className="relative overflow-hidden rounded-lg border-2 border-gray-200 hover:border-green-500 transition-colors duration-200">
                            <Image
                              src={selectedApplication.metadata.identity.selfieUrl}
                              alt="Selfie"
                              width={400}
                              height={300}
                              className="w-full h-auto object-cover"
                              unoptimized
                            />
                            <a
                              href={selectedApplication.metadata.identity.selfieUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                            >
                              <span className="text-white font-medium">View Full Size</span>
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Internal Notes</h4>
                    <div className="mb-4">
                      <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Add a note..."
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[80px]"
                      />
                      <button
                        onClick={() => handleAddNote(selectedApplication.id)}
                        className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200"
                      >
                        Add Note
                      </button>
                    </div>
                    <div className="space-y-2">
                      {applicationNotes.map((note) => (
                        <div key={note.id} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm text-gray-700">{note.note}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {note.admin_name} • {new Date(note.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Audit Trail</h4>
                    <div className="space-y-2">
                      {auditTrail.map((entry) => (
                        <div key={entry.id} className="flex items-start gap-3 text-sm">
                          <div className="w-2 h-2 bg-green-600 rounded-full mt-1.5"></div>
                          <div className="flex-1">
                            <p className="text-gray-700">{entry.details}</p>
                            <p className="text-xs text-gray-500">
                              {entry.performed_by_name} • {new Date(entry.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {(selectedApplication.status === 'pending' || selectedApplication.status === 'in_review') && (
                  <div className="flex flex-col sm:flex-row items-center justify-end gap-3 p-4 sm:p-6 border-t sticky bottom-0 bg-white">
                    <button
                      onClick={() => {
                        setShowApproveModal(selectedApplication.id)
                        setSelectedApplication(null)
                      }}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve Application
                    </button>
                    <button
                      onClick={() => {
                        setShowRejectModal(selectedApplication.id)
                        setSelectedApplication(null)
                      }}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject Application
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {showApproveModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Approve Application</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">Assign to Center</label>
                    <select
                      value={selectedCenter}
                      onChange={(e) => setSelectedCenter(e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="">Select a center...</option>
                      {centers.map((center) => (
                        <option key={center.id} value={center.id}>
                          {center.name} ({center.code}){center.branch ? ` - ${center.branch.name}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => {
                        setShowApproveModal(null)
                        setSelectedCenter('')
                      }}
                      className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleApprove(showApproveModal)}
                      className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200"
                    >
                      Confirm Approve
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {showRejectModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Reject Application</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">Rejection Reason</label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Please provide a reason for rejection..."
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[100px]"
                      required
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => {
                        setShowRejectModal(null)
                        setRejectionReason('')
                      }}
                      className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleReject(showRejectModal)}
                      className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
                    >
                      Confirm Reject
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
