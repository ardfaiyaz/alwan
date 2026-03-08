'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GlassyButton } from '@/components/ui/glassy-button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, FileText, CheckCircle, XCircle, Eye, ZoomIn, ZoomOut, X } from 'lucide-react'
import { toast } from 'sonner'
import { getDocumentApprovals, approveDocument, rejectDocument } from '@/app/actions/document-approvals'
import Image from 'next/image'

interface DocumentApproval {
  id: string
  member_id: string
  member_name: string
  document_type: string
  file_name: string
  file_url: string
  file_size: number
  mime_type: string
  status: 'pending' | 'verified' | 'rejected'
  created_at: string
  member_phone: string
  member_address: string
}

export default function DocumentApprovalsPage() {
  const [documents, setDocuments] = useState<DocumentApproval[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentApproval[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('pending')
  const [selectedDocument, setSelectedDocument] = useState<DocumentApproval | null>(null)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null)

  useEffect(() => {
    loadDocuments()
  }, [])

  useEffect(() => {
    filterDocuments()
  }, [documents, searchQuery, activeTab])

  const loadDocuments = async () => {
    try {
      setIsLoading(true)
      const result = await getDocumentApprovals()
      
      if (result.error) {
        toast.error(result.error)
        return
      }

      setDocuments(result.documents || [])
    } catch (error) {
      console.error('Error loading documents:', error)
      toast.error('Failed to load documents')
    } finally {
      setIsLoading(false)
    }
  }

  const filterDocuments = () => {
    let filtered = documents.filter(doc => doc.status === activeTab)

    if (searchQuery) {
      filtered = filtered.filter(doc =>
        doc.member_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.member_phone.includes(searchQuery) ||
        doc.document_type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredDocuments(filtered)
  }

  const handleApprove = async (documentId: string) => {
    try {
      const result = await approveDocument(documentId)
      
      if (result.error) {
        toast.error(result.error)
        return
      }

      toast.success('Document approved successfully!')
      loadDocuments()
      setSelectedDocument(null)
    } catch (error) {
      console.error('Error approving document:', error)
      toast.error('Failed to approve document')
    }
  }

  const handleReject = async (documentId: string) => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }

    try {
      const result = await rejectDocument(documentId, rejectionReason)
      
      if (result.error) {
        toast.error(result.error)
        return
      }

      toast.success('Document rejected')
      loadDocuments()
      setSelectedDocument(null)
      setShowRejectModal(null)
      setRejectionReason('')
    } catch (error) {
      console.error('Error rejecting document:', error)
      toast.error('Failed to reject document')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Pending</Badge>
      case 'verified':
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Verified</Badge>
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Rejected</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Document Approvals</h1>
          <p className="text-gray-400 mt-1">Review and approve member documents</p>
        </div>
      </div>

      {/* Search */}
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by member name, phone, or document type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white/5 border-white/10">
          <TabsTrigger value="pending">
            Pending ({documents.filter(d => d.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="verified">
            Verified ({documents.filter(d => d.status === 'verified').length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({documents.filter(d => d.status === 'rejected').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-8 text-center text-gray-400">
                Loading documents...
              </CardContent>
            </Card>
          ) : filteredDocuments.length === 0 ? (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-8 text-center text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                No documents found
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredDocuments.map((doc) => (
                <Card key={doc.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-white">{doc.member_name}</h3>
                          {getStatusBadge(doc.status)}
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Phone:</span>
                            <span className="text-white ml-2">{doc.member_phone}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Document Type:</span>
                            <span className="text-white ml-2 capitalize">{doc.document_type.replace('_', ' ')}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">File Size:</span>
                            <span className="text-white ml-2">{formatFileSize(doc.file_size)}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Uploaded:</span>
                            <span className="text-white ml-2">{new Date(doc.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div>
                          <span className="text-gray-400 text-sm">Address:</span>
                          <p className="text-white text-sm mt-1">{doc.member_address}</p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <GlassyButton
                          onClick={() => setSelectedDocument(doc)}
                          className="flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </GlassyButton>

                        {doc.status === 'pending' && (
                          <>
                            <GlassyButton
                              onClick={() => handleApprove(doc.id)}
                              className="flex items-center gap-2 bg-green-500/20 hover:bg-green-500/30"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Approve
                            </GlassyButton>
                            <GlassyButton
                              onClick={() => setShowRejectModal(doc.id)}
                              className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30"
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </GlassyButton>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Document Viewer Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="relative w-full max-w-6xl max-h-[90vh] bg-gray-900 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div>
                <h3 className="text-lg font-semibold text-white">{selectedDocument.member_name}</h3>
                <p className="text-sm text-gray-400 capitalize">{selectedDocument.document_type.replace('_', ' ')}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoomLevel(Math.max(50, zoomLevel - 25))}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ZoomOut className="w-5 h-5 text-white" />
                </button>
                <span className="text-white text-sm min-w-[60px] text-center">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ZoomIn className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => {
                    setSelectedDocument(null)
                    setZoomLevel(100)
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors ml-2"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Image Viewer */}
            <div className="overflow-auto max-h-[calc(90vh-180px)] bg-black/50 flex items-center justify-center p-4">
              <div style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center' }}>
                <Image
                  src={selectedDocument.file_url}
                  alt={selectedDocument.file_name}
                  width={800}
                  height={1000}
                  className="max-w-full h-auto"
                  unoptimized
                />
              </div>
            </div>

            {/* Actions */}
            {selectedDocument.status === 'pending' && (
              <div className="flex items-center justify-end gap-3 p-4 border-t border-white/10">
                <GlassyButton
                  onClick={() => handleApprove(selectedDocument.id)}
                  className="flex items-center gap-2 bg-green-500/20 hover:bg-green-500/30"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve Document
                </GlassyButton>
                <GlassyButton
                  onClick={() => setShowRejectModal(selectedDocument.id)}
                  className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30"
                >
                  <XCircle className="w-4 h-4" />
                  Reject Document
                </GlassyButton>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4">
          <Card className="w-full max-w-md bg-gray-900 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Reject Document</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Rejection Reason</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a reason for rejection..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/40 min-h-[100px]"
                  required
                />
              </div>
              <div className="flex gap-3">
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
                  className="flex-1 bg-red-500/20 hover:bg-red-500/30"
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
