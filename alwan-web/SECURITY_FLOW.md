# Security Flow Diagram

## Request Flow Through Security Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Request                              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 1: Authentication Check                                   │
│  ├─ Verify JWT token                                            │
│  ├─ Check session validity                                      │
│  ├─ Verify account is active                                    │
│  └─ Check account not locked                                    │
└────────────────────────────┬────────────────────────────────────┘
                             │ ✓ Authenticated
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 2: RBAC Permission Check                                  │
│  ├─ Get user role from profile                                  │
│  ├─ Check resource permission                                   │
│  ├─ Check action permission                                     │
│  └─ Log unauthorized attempts                                   │
└────────────────────────────┬────────────────────────────────────┘
                             │ ✓ Authorized
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 3: Time-Based Access Control                              │
│  ├─ Check current day of week                                   │
│  ├─ Check current hour                                          │
│  ├─ Verify within allowed time window                           │
│  └─ Apply role-specific restrictions                            │
└────────────────────────────┬────────────────────────────────────┘
                             │ ✓ Time Allowed
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 4: Rate Limiting                                          │
│  ├─ Check request count for user+action                         │
│  ├─ Verify within rate limit window                             │
│  ├─ Increment counter                                           │
│  └─ Return 429 if exceeded                                      │
└────────────────────────────┬────────────────────────────────────┘
                             │ ✓ Within Limits
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 5: Field-Level Access Control                             │
│  ├─ Identify sensitive fields                                   │
│  ├─ Check field permissions                                     │
│  ├─ Filter unauthorized fields                                  │
│  └─ Mask sensitive data                                         │
└────────────────────────────┬────────────────────────────────────┘
                             │ ✓ Data Filtered
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 6: Data Scoping                                           │
│  ├─ Get user's data scope (branch/area)                         │
│  ├─ Apply scope filters to query                                │
│  ├─ Verify resource within scope                                │
│  └─ Return only accessible data                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │ ✓ Scope Applied
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 7: Audit Logging                                          │
│  ├─ Log action details                                          │
│  ├─ Record IP and user agent                                    │
│  ├─ Store success/failure status                                │
│  └─ Add metadata                                                │
└────────────────────────────┬────────────────────────────────────┘
                             │ ✓ Logged
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Execute Business Logic                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Return Filtered Response                      │
└─────────────────────────────────────────────────────────────────┘
```

## Failure Scenarios

### Authentication Failure
```
Request → Layer 1 (Auth) → ✗ Failed
                         ↓
                    Log Attempt
                         ↓
                  Increment Counter
                         ↓
              Check Lockout Threshold
                         ↓
            Lock Account if Exceeded
                         ↓
                Return 401 Unauthorized
```

### Permission Denied
```
Request → Layer 1 ✓ → Layer 2 (RBAC) → ✗ Denied
                                      ↓
                              Log Unauthorized Attempt
                                      ↓
                              Return 403 Forbidden
```

### Rate Limit Exceeded
```
Request → Layers 1-3 ✓ → Layer 4 (Rate Limit) → ✗ Exceeded
                                               ↓
                                      Log Rate Limit Hit
                                               ↓
                                  Return 429 Too Many Requests
                                               ↓
                                    Set Retry-After Header
```

## Security Context Flow

```
┌──────────────┐
│ User Request │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────┐
│ Create Security Context              │
│ ├─ User ID                           │
│ ├─ User Role                         │
│ ├─ Session ID                        │
│ ├─ IP Address                        │
│ ├─ User Agent                        │
│ ├─ Timestamp                         │
│ └─ Data Scope                        │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ Pass Context Through Layers          │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ Use Context in Business Logic        │
│ ├─ Apply data filters                │
│ ├─ Log with context                  │
│ └─ Return scoped data                │
└──────────────────────────────────────┘
```

## Example: Approve KYC Application

```
User clicks "Approve" button
       │
       ▼
Client sends POST request
       │
       ▼
secureApproveKYC() called
       │
       ▼
performSecurityCheck('approvals', 'approve')
       │
       ├─ Layer 1: Verify user logged in ✓
       ├─ Layer 2: Check approval permission ✓
       ├─ Layer 3: Check business hours ✓
       ├─ Layer 4: Check rate limit (30/min) ✓
       ├─ Layer 5: N/A for this action
       ├─ Layer 6: Check application in user's scope ✓
       └─ Layer 7: Log approval action ✓
       │
       ▼
Execute approval logic
       │
       ├─ Update application status
       ├─ Create member record
       ├─ Assign to center
       └─ Send notification
       │
       ▼
Log successful approval to audit trail
       │
       ▼
Return success response
```

## Monitoring Points

```
┌─────────────────────────────────────────────────────────────┐
│ Security Monitoring Dashboard                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Failed Logins (Last Hour)        │  Rate Limit Hits        │
│  ▓▓▓▓▓▓▓▓░░░░░░░░░░░░ 12          │  ▓▓░░░░░░░░░░░░ 3       │
│                                    │                         │
│  Unauthorized Access Attempts      │  Sensitive Actions      │
│  ▓▓░░░░░░░░░░░░░░░░░░ 2           │  ▓▓▓▓▓▓▓▓▓▓░░░░ 15      │
│                                    │                         │
│  Active Sessions                   │  Locked Accounts        │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 45          │  ░░░░░░░░░░░░░░ 0       │
│                                    │                         │
└─────────────────────────────────────────────────────────────┘
```

---

This flow ensures defense-in-depth security with multiple checkpoints.
