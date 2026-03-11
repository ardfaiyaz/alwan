# Approvals Page Update Summary

## Changes Made

### 1. Consolidated to Single Approvals Page
- **Removed**: Old document approvals page (`/admin/approvals`)
- **Removed**: Separate KYC approvals page (`/admin/kyc-approvals`)
- **Created**: Single unified Approvals page at `/admin/approvals` for KYC applications

### 2. Browser Tab Notification
Added dynamic document title that shows pending count:
- **With pending items**: `(2) Approvals | Admin`
- **No pending items**: `Approvals | Admin`
- Updates automatically when applications are loaded

### 3. Sidebar Badge Notification
Added green badge with pending count on the Approvals link in sidebar:
- Shows count of applications with status 'pending' or 'in_review'
- Green background (#10b981 / green-500)
- Positioned at top-right of the link
- Auto-refreshes every 30 seconds
- Only shows when count > 0

### 4. Removed Duplicate Navigation
- Removed "KYC Approvals" link from sidebar
- Kept only "Approvals" link
- Removed unused `document-approvals.ts` action file

## Features

### Approvals Page (`/admin/approvals`)
- Review complete KYC applications
- View all application details (personal, business, financial, identity)
- Approve and assign to center
- Reject with reason
- Search by name, phone, or business
- Filter by status (pending, in_review, approved, rejected, all)
- Sort by submitted date or created date
- Fully responsive (mobile to desktop)

### Sidebar Badge
- Real-time pending count
- Green badge with white text
- Auto-refresh every 30 seconds
- Only visible when there are pending items

### Browser Tab
- Shows pending count in title
- Format: `(count) Approvals | Admin`
- Updates when data loads

## Technical Details

### Pending Count Query
```typescript
const { count } = await supabase
  .from('kyc_applications')
  .select('*', { count: 'exact', head: true })
  .in('status', ['pending', 'in_review'])
```

### Document Title Update
```typescript
useEffect(() => {
  const pendingCount = applications.filter(
    a => a.status === 'pending' || a.status === 'in_review'
  ).length
  
  if (pendingCount > 0) {
    document.title = `(${pendingCount}) Approvals | Admin`
  } else {
    document.title = 'Approvals | Admin'
  }
}, [applications])
```

### Badge Styling
```tsx
<span className="absolute top-1 right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-green-500 rounded-full">
  {pendingCount}
</span>
```

## Files Modified

1. **alwan-web/src/app/admin/approvals/page.tsx**
   - Moved from kyc-approvals
   - Added document title update
   - Renamed component to `ApprovalsPage`

2. **alwan-web/src/components/admin/Sidebar.tsx**
   - Removed "KYC Approvals" navigation item
   - Added pending count state
   - Added badge to "Approvals" link
   - Added auto-refresh every 30 seconds

3. **Deleted Files**:
   - `alwan-web/src/app/actions/document-approvals.ts`
   - `alwan-web/src/app/admin/kyc-approvals/page.tsx`

## User Experience

### Before
- Two separate approval pages (confusing)
- No notification of pending items
- Had to navigate to page to see if there were pending approvals

### After
- Single unified Approvals page
- Browser tab shows pending count at a glance
- Sidebar badge shows pending count
- Clear visual indicator when action is needed
- Auto-refreshing count (every 30 seconds)

## Next Steps

If you want to add more features:
1. **Push notifications** when new applications arrive
2. **Email notifications** for pending approvals
3. **Bulk approve/reject** functionality
4. **Export to CSV** for reporting
5. **Advanced filters** (by date range, location, etc.)
