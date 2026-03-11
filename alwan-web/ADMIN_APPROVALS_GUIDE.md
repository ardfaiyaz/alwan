# Admin Approvals Guide

## Two Types of Approvals Pages

### 1. KYC Approvals (`/admin/kyc-approvals`)
**Purpose**: Review and approve NEW member applications

**What it handles**:
- Complete KYC (Know Your Customer) applications submitted during signup
- All 12 steps of the signup form data stored in `kyc_applications` table
- Personal info, address, business details, financial info, identity verification, etc.
- Assigns approved applicants to a center
- Creates full member record in the system upon approval

**Workflow**:
1. User completes 12-step KYC signup form
2. Application stored in `kyc_applications` table with status 'in_review'
3. Admin reviews application in KYC Approvals page
4. Admin approves and assigns to a center
5. System automatically creates:
   - Member record
   - Member profile
   - Member address
   - Member identification
   - Member business
   - Member financial info
   - Member guarantor (if provided)
   - Member documents

**Status Flow**: pending → in_review → approved/rejected

---

### 2. Document Approvals (`/admin/approvals`)
**Purpose**: Review documents uploaded by EXISTING members

**What it handles**:
- Individual document uploads from members who are already in the system
- Document types: ID updates, business permits, proof of billing, etc.
- Stored in `member_documents` table
- Simple approve/reject for each document

**Workflow**:
1. Existing member uploads a document
2. Document stored in `member_documents` table with status 'pending'
3. Admin reviews document in Approvals page
4. Admin approves or rejects the document
5. Document status updated to 'verified' or 'rejected'

**Status Flow**: pending → verified/rejected

---

## Key Differences

| Feature | KYC Approvals | Document Approvals |
|---------|---------------|-------------------|
| **For** | New applicants | Existing members |
| **Data Source** | `kyc_applications` table | `member_documents` table |
| **Complexity** | Full application with 12 steps | Single document |
| **Action** | Approve + Assign Center | Approve/Reject only |
| **Creates** | Complete member record | Updates document status |
| **Metadata** | JSONB with all form data | File info only |

---

## Recent Fixes

### 1. Fixed React Hydration Error
**Issue**: Page was showing "Oops! Something went wrong" due to React Error #130
**Cause**: The page file was empty/corrupted
**Fix**: Recreated the page with proper null checks and fixed styling to use light theme instead of dark theme

### 2. Added Admin Redirect
**Issue**: Admins could access client-facing pages (homepage, services, contact, FAQ)
**Fix**: Updated middleware to automatically redirect authenticated admin users to `/admin/dashboard` when they try to access:
- Homepage (`/`)
- Services page (`/services`)
- Contact page (`/contact`)
- FAQ page (`/faq`)

**Affected Roles**: admin, area_manager, branch_manager, field_officer

### 3. Fixed Styling
**Issue**: KYC approvals page was using dark theme (white text on dark background)
**Fix**: Changed to light theme matching the rest of the admin panel:
- White background
- Dark text
- Light gray borders
- Proper contrast for readability

---

## Usage

### For KYC Approvals:
1. Navigate to "KYC Approvals" in admin sidebar
2. View all pending/in_review applications
3. Click "View" to see full application details
4. Click "Approve" to assign to a center and create member
5. Click "Reject" to reject with a reason

### For Document Approvals:
1. Navigate to "Approvals" in admin sidebar
2. View all pending documents
3. Click "View" to see document image
4. Click "Approve" to verify document
5. Click "Reject" to reject with a reason

---

## Database Schema

### kyc_applications
```sql
- id (uuid)
- user_id (uuid) - links to auth.users
- mobile_number (text)
- status (kyc_status) - pending, in_review, approved, rejected
- metadata (jsonb) - all form data
- submitted_at (timestamp)
- approved_by (uuid)
- approved_at (timestamp)
```

### member_documents
```sql
- id (uuid)
- member_id (uuid) - links to members table
- document_type (text)
- file_url (text)
- status (text) - pending, verified, rejected
- created_at (timestamp)
```

---

## Notes

- KYC approvals require center assignment before approval
- Document approvals are simpler and don't require additional data
- Both pages support search, filtering, and sorting
- Both pages are responsive from mobile to desktop
- Admin users are automatically redirected from client pages to dashboard
