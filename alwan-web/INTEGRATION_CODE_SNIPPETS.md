# Integration Code Snippets for Approvals Page

## Step 1: Add Imports (Add to top of page.tsx)

```typescript
// Add these new imports
import { getApprovalStatistics } from '@/app/actions/approval-statistics'
import { logAuditTrail, getAuditTrail } from '@/app/actions/audit-trail'
import { addApplicationNote, getApplicationNotes } from '@/app/actions/approval-notes'
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
import { Download, Filter, Printer, Keyboard } from 'lucide-react'
```

## Step 2: Add State Variables (Add after existing useState declarations)

```typescript
// Bulk actions
const [selectedIds, setSelectedIds] = useState<string[]>([])

// Advanced filters
const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
const [advancedFilters, setAdvancedFilters] = useState<AdvancedFiltersType>({})

// Statistics
const [statistics, setStatistics] = useState<ApprovalStatistics | null>(null)

// Keyboard shortcuts
const [showKeyboardHelp, setShowKeyboardHelp] = useState(false)

// Notes and audit trail
const [applicationNotes, setApplicationNotes] = useState<ApplicationNote[]>([])
const [auditTrail, setAuditTrail] = useState<AuditTrailEntry[]>([])
const [newNote, setNewNote] = useState('')
```

## Step 3: Add Helper Functions (Add before loadData function)

```typescript
const loadStatistics = async () => {
  const { statistics } = await getApprovalStatistics()
  if (statistics) {
    setStatistics(statistics)
  }
}

const handleSelectApplication = (id: string) => {
  setSelectedIds(prev => 
    prev.includes(id) ? prev.filter(appId => appId !== id) : [...prev, id]
  )
}

const handleBulkApprove = () => {
  if (selectedIds.length === 0) return
  toast.info(`Bulk approve ${selectedIds.length} applications`)
  // Show modal to select center for all
  setShowApproveModal('bulk')
}

const handleBulkReject = () => {
  if (selectedIds.length === 0) return
  toast.info(`Bulk reject ${selectedIds.length} applications`)
  setShowRejectModal('bulk')
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
    adminId: 'admin-user-id', // Replace with actual admin ID
    adminName: 'Admin User' // Replace with actual admin name
  })
  
  if (result.error) {
    toast.error(result.error)
  } else {
    toast.success('Note added')
    setNewNote('')
    loadNotesAndAudit(applicationId)
  }
}
```

## Step 4: Update loadData Function (Replace existing)

```typescript
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
```

## Step 5: Add Keyboard Shortcuts (Add after state declarations)

```typescript
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
```

## Step 6: Update JSX - Add Statistics Dashboard (Add after header, before search)

```typescript
{/* Statistics Dashboard */}
<StatisticsDashboard statistics={statistics} isLoading={isLoading} />
```

## Step 7: Update JSX - Add Action Buttons (Add in header section)

```typescript
<div className="flex items-center gap-2">
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
```

## Step 8: Replace Application Cards (Replace the map function in TabsContent)

```typescript
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
```

## Step 9: Add Bulk Actions Bar (Add before closing div of main container)

```typescript
{/* Bulk Actions Bar */}
<BulkActionsBar
  selectedCount={selectedIds.length}
  onApproveSelected={handleBulkApprove}
  onRejectSelected={handleBulkReject}
  onClearSelection={() => setSelectedIds([])}
/>
```

## Step 10: Add Modals (Add before closing div)

```typescript
{/* Advanced Filters Modal */}
{showAdvancedFilters && (
  <AdvancedFilters
    filters={advancedFilters}
    onFiltersChange={(filters) => {
      setAdvancedFilters(filters)
      // Apply filters logic here
    }}
    onClose={() => setShowAdvancedFilters(false)}
  />
)}

{/* Keyboard Shortcuts Help */}
{showKeyboardHelp && (
  <KeyboardShortcutsHelp
    shortcuts={shortcuts}
    onClose={() => setShowKeyboardHelp(false)}
  />
)}
```

## Step 11: Add Print Button to View Modal (Add in modal actions)

```typescript
<button
  onClick={() => selectedApplication && handlePrint(selectedApplication)}
  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors duration-200"
  title="Print (Ctrl+P)"
>
  <Printer className="w-4 h-4" />
  Print
</button>
```

## Step 12: Add Notes Section to View Modal (Add in modal content)

```typescript
{/* Notes Section */}
<div className="border-t pt-4">
  <h4 className="text-lg font-semibold text-gray-900 mb-3">Internal Notes</h4>
  
  {/* Add Note Form */}
  <div className="mb-4">
    <textarea
      value={newNote}
      onChange={(e) => setNewNote(e.target.value)}
      placeholder="Add a note..."
      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[80px]"
    />
    <button
      onClick={() => selectedApplication && handleAddNote(selectedApplication.id)}
      className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200"
    >
      Add Note
    </button>
  </div>
  
  {/* Notes List */}
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

{/* Audit Trail Section */}
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
```

---

## Complete Integration Checklist

- [ ] Add all imports
- [ ] Add state variables
- [ ] Add helper functions
- [ ] Update loadData function
- [ ] Add keyboard shortcuts
- [ ] Add statistics dashboard to JSX
- [ ] Add action buttons to header
- [ ] Replace application cards with ApplicationCard component
- [ ] Add bulk actions bar
- [ ] Add advanced filters modal
- [ ] Add keyboard shortcuts help modal
- [ ] Add print button to view modal
- [ ] Add notes section to view modal
- [ ] Add audit trail section to view modal
- [ ] Test all features
- [ ] Commit and push

## Testing Checklist

- [ ] Statistics dashboard loads correctly
- [ ] Advanced filters work
- [ ] Bulk selection works
- [ ] Bulk approve/reject works
- [ ] Export CSV works
- [ ] Export Excel works
- [ ] Print works
- [ ] Keyboard shortcuts work
- [ ] Notes can be added
- [ ] Audit trail displays
- [ ] Responsive on mobile
- [ ] Responsive on tablet
- [ ] Responsive on desktop

