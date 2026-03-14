# Security Quick Start Guide

## 1. Apply Database Migrations

```bash
# Navigate to your Supabase project
cd alwan-web

# Apply security migrations
psql -h your-db-host -U postgres -d your-database \
  -f supabase/migrations/20240315_create_security_audit_logs.sql

psql -h your-db-host -U postgres -d your-database \
  -f supabase/migrations/20240316_add_security_fields_to_profiles.sql
```

## 2. Update Server Actions

Replace existing actions with secure versions:

```typescript
// Before
import { approveKYCWithCenter } from '@/app/actions/kyc-approvals'

// After
import { secureApproveKYC } from '@/app/actions/secure-kyc-approvals'
```

## 3. Protect New Server Actions

```typescript
import { performSecurityCheck } from '@/lib/rbac/security-middleware'

export async function myAction() {
  const check = await performSecurityCheck('resource', 'action')
  if (!check.allowed) return { error: check.reason }
  
  // Your logic here
}
```

## 4. Test Security Features

- Try accessing admin pages without login
- Test rate limiting with rapid requests
- Verify field-level access control
- Check audit logs in database

## Security Layers Active

✅ Authentication & Session Management
✅ Role-Based Access Control (RBAC)
✅ Time-Based Access Control
✅ Rate Limiting
✅ Field-Level Access Control
✅ Data Classification & Scoping
✅ Comprehensive Audit Trail

See SECURITY_ARCHITECTURE.md for full details.
