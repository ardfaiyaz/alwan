# Quick Start: Document Approvals System

## What Was Built

A complete document upload and approval system for member signups:

1. **Signup Flow**: Members upload proof of billing during signup
2. **Admin Approvals Page**: Admins can view, zoom, approve, or reject documents
3. **Audit Trail**: All actions are logged

## Setup (5 minutes)

### Step 1: Run Migrations

```bash
cd alwan-web

# Apply all migrations
supabase db push

# Or run individually:
supabase migration up 20240309_create_member_documents_table.sql
supabase migration up create_member_documents_bucket.sql
supabase migration up 20240309_create_pending_center.sql
```

### Step 2: Verify Setup

1. Check Supabase Dashboard → Storage
   - Verify `member-documents` bucket exists

2. Check Supabase Dashboard → Database
   - Verify `member_documents` table exists
   - Verify `PENDING` center exists in `centers` table

### Step 3: Test Signup

1. Open your web app
2. Click "Get Started"
3. Fill in the form and upload a document
4. Complete phone verification
5. Create PIN

### Step 4: Test Admin Approvals

1. Login as admin
2. Go to `/admin/approvals`
3. You should see the uploaded document in "Pending" tab
4. Click "View" to open the document
5. Use zoom controls to inspect
6. Approve or reject the document

## File Locations

```
alwan-web/
├── src/
│   ├── app/
│   │   ├── actions/
│   │   │   ├── signup.ts                    # ✅ Signup with document upload
│   │   │   └── document-approvals.ts        # ✅ Approval actions
│   │   └── admin/
│   │       └── approvals/
│   │           └── page.tsx                 # ✅ Approvals page with zoom
│   └── components/
│       └── ui/
│           └── SignupModal.tsx              # ✅ Updated with document upload
└── supabase/
    └── migrations/
        ├── 20240309_create_member_documents_table.sql    # ✅ Table schema
        ├── create_member_documents_bucket.sql            # ✅ Storage bucket
        └── 20240309_create_pending_center.sql            # ✅ Default center
```

## Features

### Signup Modal
- ✅ 4-step process (Info → Phone → OTP → PIN)
- ✅ Document upload with preview
- ✅ File validation
- ✅ Automatic storage upload

### Admin Approvals Page
- ✅ Three tabs: Pending, Verified, Rejected
- ✅ Search by name, phone, document type
- ✅ Document viewer modal
- ✅ Zoom controls (50% - 200%)
- ✅ Approve/Reject with reason
- ✅ Audit logging
- ✅ Real-time updates

### Security
- ✅ RLS policies for data access
- ✅ Role-based access (admin, area_manager, branch_manager)
- ✅ Audit trail for all actions
- ✅ Secure file storage

## Access Control

### Who Can Access Approvals Page?
- ✅ Admin
- ✅ Area Manager
- ✅ Branch Manager
- ❌ Field Officer (no access)

### Navigation
The "Approvals" link is already added to the admin sidebar.

## Troubleshooting

### Issue: "No center available for assignment"
**Solution**: Run the pending center migration:
```bash
supabase migration up 20240309_create_pending_center.sql
```

### Issue: "Failed to upload document"
**Solution**: Check storage bucket exists:
```bash
supabase storage ls
```
Should show `member-documents` bucket.

### Issue: Can't see approvals page
**Solution**: Check your user role in the database:
```sql
SELECT role FROM profiles WHERE id = 'your-user-id';
```
Role must be 'admin', 'area_manager', or 'branch_manager'.

### Issue: TypeScript error on imports
**Solution**: Restart TypeScript server in VS Code:
- Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
- Type "TypeScript: Restart TS Server"
- Press Enter

## Next Steps

1. **Test the full flow** end-to-end
2. **Add PDF support** for document viewer
3. **Add email notifications** for approval/rejection
4. **Add bulk actions** for multiple documents
5. **Add document expiration** dates

## Support

For detailed documentation, see `DOCUMENT_APPROVALS_IMPLEMENTATION.md`
