'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GlassyButton } from '@/components/ui/glassy-button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, FileText, CheckCircle, XCircle, Eye, User, Building2, MapPin, Phone, Mail, Calendar, X } from 'lucide-react'
import { toast } from 'sonner'
import { 
  getKYCApplications, 
  getActiveCenters, 
  approveKYCWithCenter, 
  rejectKYC,
  type KYCApplication 
} from '@/app/actions/kyc-approvals'
import Image from 'next/image'

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

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterApplications()
  }, [applications, searchQuery, activeTab])

  useEffect(() => {
    // Update document title with pending count
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
      
      const [appsResult, centersResult] = await Promise.all([
        getKYCApplications({ status: 'all', sortBy, sortOrder }),
        getActiveCenters()
      ])
      
      if (appsResult.error) {
        toast.error(appsResult.error)
        console.error('Applications error:', appsResult.error)
      } else {
        console.log('Loaded applications:', appsResult.applications.length, appsResult.applications)
        setApplications(appsResult.applications)
      }

      if (centersResult.error) {
        toast.error(centersResult.error)
        console.error('Centers error:', centersResult.error)
      } else {
        console.log('Loaded centers:', centersResult.centers.length)
        setCenters(centersResult.centers)
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
        
        return fullName.includes(searchLower) || 
               phone.includes(searchLower) || 
               business.includes(searchLower)
      })
    }

    setFilteredApplications(filtered)
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Pending</Badge>
      case 'in_review':
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">In Review</Badge>
      case 'approved':
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Approved</Badge>
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Rejected</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

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
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Approvals</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Review and approve member applications</p>
        </div>
      </div>

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

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 sm:grid-cols-5 w-full sm:w-auto">
          <TabsTrigger value="pending" className="text-xs sm:text-sm">
            Pending ({applications.filter(a => a.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="in_review" className="text-xs sm:text-sm">
            In Review ({applications.filter(a => a.status === 'in_review').length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="text-xs sm:text-sm">
            Approved ({applications.filter(a => a.status === 'approved').length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="text-xs sm:text-sm">
            Rejected ({applications.filter(a => a.status === 'rejected').length})
          </TabsTrigger>
          <TabsTrigger value="all" className="text-xs sm:text-sm col-span-2 sm:col-span-1">
            All ({applications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4 sm:mt-6">
          {isLoading ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-600">
                Loading applications...
              </CardContent>
            </Card>
          ) : filteredApplications.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-600">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No applications found</p>
                <p className="text-xs mt-2">Total applications loaded: {applications.length}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredApplications.map((app) => {
                if (!app.metadata) {
                  return (
                    <Card key={app.id}>
                      <CardContent className="p-4 sm:p-6">
                        <div className="text-yellow-600">
                          <p>Application ID: {app.id}</p>
                          <p>Status: {app.status}</p>
                          <p>Phone: {app.mobile_number}</p>
                          <p className="text-red-600 mt-2">Warning: No metadata found for this application</p>
                        </div>
                      </CardContent>
                    </Card>
                  )
                }
                
                const metadata = app.metadata
                const fullName = `${metadata.firstName || ''} ${metadata.middleName || ''} ${metadata.lastName || ''}`.trim() || 'No Name'
                
                return (
                  <Card key={app.id} className="hover:shadow-md transition-shadow duration-300 ease-in-out">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                            <h3 className="text-lg font-semibold text-gray-900">{fullName}</h3>
                            {getStatusBadge(app.status)}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-700">{app.mobile_number || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-700 truncate">{metadata.email || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-700 truncate">{metadata.business?.businessName || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-700 truncate">
                                {metadata.address?.city || 'N/A'}, {metadata.address?.province || 'N/A'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-700 text-xs sm:text-sm">
                                {app.submitted_at ? formatDate(app.submitted_at) : 'Not submitted'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-700 capitalize">{metadata.gender || 'N/A'}</span>
                            </div>
                          </div>

                          {app.rejection_reason && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                              <p className="text-red-700 text-sm">
                                <span className="font-semibold">Rejection Reason:</span> {app.rejection_reason}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-row lg:flex-col gap-2">
                          <GlassyButton
                            onClick={() => setSelectedApplication(app)}
                            className="flex items-center justify-center gap-2 flex-1 lg:flex-none lg:w-full"
                          >
                            <Eye className="w-4 h-4" />
                            <span className="hidden sm:inline">View</span>
                          </GlassyButton>

                          {(app.status === 'pending' || app.status === 'in_review') && (
                            <>
                              <GlassyButton
                                onClick={() => setShowApproveModal(app.id)}
                                className="flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 flex-1 lg:flex-none lg:w-full"
                              >
                                <CheckCircle className="w-4 h-4" />
                                <span className="hidden sm:inline">Approve</span>
                              </GlassyButton>
                              <GlassyButton
                                onClick={() => setShowRejectModal(app.id)}
                                className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 flex-1 lg:flex-none lg:w-full"
                              >
                                <XCircle className="w-4 h-4" />
                                <span className="hidden sm:inline">Reject</span>
                              </GlassyButton>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

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
              <button
                onClick={() => setSelectedApplication(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-300 ease-in-out"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div>
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

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Address</h4>
                <p className="text-gray-900 text-sm">
                  {selectedApplication.metadata.address.houseNumber} {selectedApplication.metadata.address.street}, {selectedApplication.metadata.address.barangay}, {selectedApplication.metadata.address.city}, {selectedApplication.metadata.address.province} {selectedApplication.metadata.address.zipCode}
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  Housing: <span className="text-gray-900 capitalize">{selectedApplication.metadata.address.housingType}</span>
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
                    <span className="text-gray-900 ml-2">{selectedApplication.metadata.business.yearsOperating}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Monthly Revenue:</span>
                    <span className="text-gray-900 ml-2">₱{selectedApplication.metadata.business.monthlyRevenue}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Financial Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Monthly Income:</span>
                    <span className="text-gray-900 ml-2">₱{selectedApplication.metadata.financial.monthlyIncome}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Monthly Expenses:</span>
                    <span className="text-gray-900 ml-2">₱{selectedApplication.metadata.financial.monthlyExpenses}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Identity Verification</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
                  <div>
                    <span className="text-gray-600">ID Type:</span>
                    <span className="text-gray-900 ml-2 capitalize">{selectedApplication.metadata.identity.idType.replace('_', ' ')}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">ID Number:</span>
                    <span className="text-gray-900 ml-2">{selectedApplication.metadata.identity.idNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Face Match Score:</span>
                    <span className="text-gray-900 ml-2">{(selectedApplication.metadata.identity.faceMatchScore * 100).toFixed(1)}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {selectedApplication.metadata.identity.idFrontUrl && (
                    <div>
                      <p className="text-gray-600 text-xs mb-2">ID Front</p>
                      <Image
                        src={selectedApplication.metadata.identity.idFrontUrl}
                        alt="ID Front"
                        width={200}
                        height={150}
                        className="w-full h-auto rounded-lg border"
                        unoptimized
                      />
                    </div>
                  )}
                  {selectedApplication.metadata.identity.idBackUrl && (
                    <div>
                      <p className="text-gray-600 text-xs mb-2">ID Back</p>
                      <Image
                        src={selectedApplication.metadata.identity.idBackUrl}
                        alt="ID Back"
                        width={200}
                        height={150}
                        className="w-full h-auto rounded-lg border"
                        unoptimized
                      />
                    </div>
                  )}
                  {selectedApplication.metadata.identity.selfieUrl && (
                    <div>
                      <p className="text-gray-600 text-xs mb-2">Selfie</p>
                      <Image
                        src={selectedApplication.metadata.identity.selfieUrl}
                        alt="Selfie"
                        width={200}
                        height={150}
                        className="w-full h-auto rounded-lg border"
                        unoptimized
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {(selectedApplication.status === 'pending' || selectedApplication.status === 'in_review') && (
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 p-4 sm:p-6 border-t sticky bottom-0 bg-white">
                <GlassyButton
                  onClick={() => {
                    setShowApproveModal(selectedApplication.id)
                    setSelectedApplication(null)
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-700"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve Application
                </GlassyButton>
                <GlassyButton
                  onClick={() => {
                    setShowRejectModal(selectedApplication.id)
                    setSelectedApplication(null)
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700"
                >
                  <XCircle className="w-4 h-4" />
                  Reject Application
                </GlassyButton>
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
                <GlassyButton
                  onClick={() => {
                    setShowApproveModal(null)
                    setSelectedCenter('')
                  }}
                  className="flex-1"
                >
                  Cancel
                </GlassyButton>
                <GlassyButton
                  onClick={() => handleApprove(showApproveModal)}
                  className="flex-1 bg-green-50 hover:bg-green-100 text-green-700"
                >
                  Confirm Approve
                </GlassyButton>
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
                <GlassyButton
                  onClick={() => {
                    setShowRejectModal(null)
                    setRejectionReason('')
                  }}
                  className="flex-1"
                >
                  Cancel
                </GlassyButton>
                <GlassyButton
                  onClick={() => handleReject(showRejectModal)}
                  className="flex-1 bg-red-50 hover:bg-red-100 text-red-700"
                >
                  Confirm Reject
                </GlassyButton>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
