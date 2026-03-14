# Multi-Layer Security Architecture

## Overview
This document describes the comprehensive security architecture implemented for the ALWAN microfinance platform, featuring defense-in-depth with 7 layers of security.

## Security Layers

### Layer 1: Authentication & Session Management
- **Supabase Auth Integration**: Secure authentication with JWT tokens
- **Session Tracking**: Monitor active sessions with IP and user agent
- **Session Expiry**: Automatic session timeout after inactivity
- **Account Lockout**: Lock accounts after 5 failed login attempts for 15 minutes
- **Password Policy**: 
  - Passwords expire after 90 days
  - Force password change on expiry
  - Track last password change timestamp

**Implementation**: `src/middleware.ts`, `supabase/migrations/20240316_add_security_fields_to_profiles.sql`

### Layer 2: Role-Based Access Control (RBAC)
- **Four Role Hierarchy**:
  - `admin`: Full system access
  - `area_manager`: Multi-branch oversight
  - `branch_manager`: Single branch management
  - `field_officer`: Field operations only

- **Permission Matrix**: Granular permissions for each resource and action
- **Page-Level Access Control**: Route protection based on role
- **Dynamic Route Protection**: Handles nested and dynamic routes

**Implementation**: `src/lib/rbac/permissions.ts`, `src/middleware.ts`

### Layer 3: Time-Based Access Control
- **Business Hours Enforcement**: Field officers restricted to 8 AM - 6 PM, Monday-Friday
- **Timezone Support**: Asia/Manila timezone for Philippine operations
- **Flexible Configuration**: Easy to adjust per role

**Implementation**: `src/lib/rbac/security-layers.ts`

### Layer 4: Rate Limiting
- **Per-Role Limits**: Different rate limits based on user role
- **Action-Specific Limits**: Separate limits for different operations
- **Examples**:
  - Admin: 100 approvals/minute
  - Branch Manager: 30 approvals/minute
  - Field Officer: 20 member creations/minute

**Implementation**: `src/lib/rbac/security-layers.ts`, `src/lib/rbac/security-middleware.ts`

### Layer 5: Field-Level Access Control
- **Sensitive Data Protection**: Control access to specific fields
- **Read-Only Fields**: Some fields visible but not editable
- **Data Masking**: Redact unauthorized fields with `***REDACTED***`
- **Examples**:
  - SSN: Admin only
  - Bank accounts: Admin, Area Manager, Branch Manager
  - Credit scores: Admin, Area Manager only

**Implementation**: `src/lib/rbac/enhanced-permissions.ts`

### Layer 6: Data Classification & Scoping
- **Four Classification Levels**:
  - `PUBLIC`: General information
  - `INTERNAL`: Internal use only
  - `CONFIDENTIAL`: Sensitive business data
  - `RESTRICTED`: Highly sensitive system data

- **Data Scoping**: Users only see data within their scope
  - Admin: All data
  - Area Manager: Assigned area only
  - Branch Manager: Assigned branch only
  - Field Officer: Assigned centers only

**Implementation**: `src/lib/rbac/enhanced-permissions.ts`, `src/lib/rbac/security-layers.ts`

### Layer 7: Comprehensive Audit Trail
- **Security Event Logging**: All security-relevant actions logged
- **Tracked Information**:
  - User ID and role
  - Action performed
  - Resource accessed
  - IP address and user agent
  - Success/failure status
  - Failure reasons
  - Additional metadata

- **Audit Log Retention**: 1-year retention with automatic cleanup
- **Query Performance**: Indexed for fast searching

**Implementation**: `supabase/migrations/20240315_create_security_audit_logs.sql`, `src/lib/rbac/security-middleware.ts`

## Additional Security Features

### Sensitive Action Protection
Certain high-risk actions require additional verification:
- Member deletion: Requires secondary auth + admin approval + 5-minute cooldown
- Loan deletion: Requires secondary auth + admin approval + 5-minute cooldown
- User deletion: Requires secondary auth + admin approval + 10-minute cooldown
- Settings changes: Requires secondary authentication

### Security Headers
All admin routes include security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### IP-Based Protection
- Failed attempt tracking per IP address
- Automatic lockout after excessive failures
- Rate limiting with `429 Too Many Requests` response

## Database Security

### Row-Level Security (RLS)
All tables have RLS policies:
- Users can only access their own data
- Admins can access all data
- Role-based filtering for shared resources

### Secure Functions
Database functions use `SECURITY DEFINER` for controlled privilege escalation:
- `handle_failed_login()`: Track failed attempts
- `handle_successful_login()`: Reset security counters
- `unlock_expired_accounts()`: Auto-unlock after timeout
- `cleanup_old_security_logs()`: Maintain audit log retention

## Usage Examples

### Protecting Server Actions
```typescript
import { performSecurityCheck } from '@/lib/rbac/security-middleware'

export async function mySecureAction() {
  const securityCheck = await performSecurityCheck('members', 'create', {
    requireAuth: true,
    checkRateLimit: true,
    checkTimeRestrictions: true,
    logAudit: true,
  })

  if (!securityCheck.allowed) {
    return { error: securityCheck.reason }
  }

  // Proceed with action
  const context = securityCheck.context!
  // ... your logic here
}
```

### Filtering Sensitive Data
```typescript
import { filterSensitiveFields } from '@/lib/rbac/enhanced-permissions'

const memberData = await fetchMember(id)
const filtered = filterSensitiveFields(userRole, 'members', memberData)
// Returns only fields the user is authorized to see
```

### Using the Security Decorator
```typescript
import { withSecurity } from '@/lib/rbac/security-middleware'

export const createMember = withSecurity('members', 'create', async (data) => {
  // This function only runs if security checks pass
  return await db.members.create(data)
})
```

## Monitoring & Alerts

### Key Metrics to Monitor
1. Failed login attempts per IP/user
2. Rate limit violations
3. Unauthorized access attempts
4. Sensitive action executions
5. Time-based access violations

### Recommended Alerts
- Alert on 10+ failed logins from same IP in 5 minutes
- Alert on any unauthorized access to restricted resources
- Alert on sensitive actions (deletions, settings changes)
- Alert on unusual activity patterns

## Compliance

This security architecture supports compliance with:
- **Data Privacy Act of 2012 (Philippines)**: Data classification and access control
- **BSP Regulations**: Audit trails and access logging
- **ISO 27001**: Information security management
- **PCI DSS**: If handling payment card data

## Migration Guide

### Applying Security Migrations
```bash
# Run migrations in order
psql -f supabase/migrations/20240315_create_security_audit_logs.sql
psql -f supabase/migrations/20240316_add_security_fields_to_profiles.sql
```

### Updating Existing Actions
Replace existing approval actions with secure versions:
```typescript
// Old
import { approveKYC } from '@/app/actions/kyc-approvals'

// New
import { secureApproveKYC } from '@/app/actions/secure-kyc-approvals'
```

## Testing Security

### Test Cases
1. **Authentication**: Try accessing admin routes without login
2. **Authorization**: Try accessing resources without permission
3. **Rate Limiting**: Make rapid requests to trigger limits
4. **Time Restrictions**: Access as field officer outside business hours
5. **Field Access**: Verify sensitive fields are masked for unauthorized roles
6. **Audit Logging**: Verify all actions are logged correctly

### Security Checklist
- [ ] All admin routes protected by middleware
- [ ] All server actions use `performSecurityCheck()`
- [ ] Sensitive data filtered before sending to client
- [ ] Audit logs enabled for all critical actions
- [ ] Rate limits configured appropriately
- [ ] Time restrictions tested for field officers
- [ ] Account lockout working after failed attempts
- [ ] Security headers present on all responses

## Future Enhancements

1. **Multi-Factor Authentication (MFA)**: TOTP-based 2FA
2. **Biometric Authentication**: Fingerprint/face recognition
3. **Advanced Anomaly Detection**: ML-based threat detection
4. **Real-time Security Dashboard**: Monitor security events live
5. **Automated Threat Response**: Auto-block suspicious IPs
6. **Security Compliance Reports**: Automated compliance reporting

## Support

For security concerns or questions:
- Review this documentation
- Check audit logs in `security_audit_logs` table
- Contact security team for incidents
- Report vulnerabilities through secure channel

---

**Last Updated**: March 2024  
**Version**: 1.0  
**Maintained By**: Security Team
