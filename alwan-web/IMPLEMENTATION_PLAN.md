# Enterprise KYC Signup Implementation Plan

## Project Scope
Transform the current modal-based signup into a comprehensive, enterprise-grade KYC onboarding system compliant with Philippine financial regulations.

## Regulatory Compliance
- **BSP** (Bangko Sentral ng Pilipinas)
- **SEC** (Securities and Exchange Commission)
- **Data Privacy Act of 2012**
- **Anti-Money Laundering Act**

## Phase 1: Database Schema Updates

### New Tables Required

#### 1. `kyc_applications` (Main KYC tracking)
```sql
- id (uuid, PK)
- user_id (uuid, FK to auth.users)
- mobile_number (text, unique)
- status (enum: pending, in_review, approved, rejected)
- current_step (integer)
- completed_steps (jsonb)
- kyc_level (enum: basic, intermediate, full)
- rejection_reason (text)
- approved_by (uuid, FK to profiles)
- approved_at (timestamp)
- created_at, updated_at
```

#### 2. `member_profiles` (Extended member information)
```sql
- id (uuid, PK)
- member_id (uuid, FK to members)
- civil_status (enum)
- nationality (text)
- mothers_maiden_name (text)
- number_of_dependents (integer)
- email (text)
- alternate_phone (text)
- created_at, updated_at
```

#### 3. `member_addresses` (Detailed address)
```sql
- id (uuid, PK)
- member_id (uuid, FK to members)
- house_number (text)
- street (text)
- barangay (text)
- city (text)
- province (text)
- zip_code (text)
- years_living (integer)
- housing_type (enum: owned, renting, family)
- is_primary (boolean)
- created_at, updated_at
```

#### 4. `member_identifications` (KYC documents)
```sql
- id (uuid, PK)
- member_id (uuid, FK to members)
- id_type (enum: national_id, drivers_license, passport, umid, philhealth)
- id_number (text)
- id_front_url (text)
- id_back_url (text)
- selfie_url (text)
- face_match_score (numeric)
- face_match_verified (boolean)
- verified_by (uuid)
- verified_at (timestamp)
- created_at, updated_at
```

#### 5. `member_businesses` (Business information)
```sql
- id (uuid, PK)
- member_id (uuid, FK to members)
- business_name (text)
- business_type (text)
- business_address (text)
- years_operating (integer)
- registration_type (enum: dti, barangay_permit, none)
- registration_number (text)
- daily_sales (numeric)
- monthly_revenue (numeric)
- number_of_employees (integer)
- created_at, updated_at
```

#### 6. `member_financial_info` (Financial details)
```sql
- id (uuid, PK)
- member_id (uuid, FK to members)
- monthly_income (numeric)
- other_income_sources (text)
- monthly_expenses (numeric)
- existing_loans (jsonb)
- assets (jsonb)
- created_at, updated_at
```

#### 7. `member_guarantors` (Co-borrowers)
```sql
- id (uuid, PK)
- member_id (uuid, FK to members)
- full_name (text)
- relationship (text)
- address (text)
- phone (text)
- occupation (text)
- id_document_url (text)
- created_at, updated_at
```

#### 8. `legal_consents` (Consent tracking)
```sql
- id (uuid, PK)
- user_id (uuid, FK to auth.users)
- consent_type (enum: terms, privacy, data_privacy, credit_investigation)
- version (text)
- accepted_at (timestamp)
- ip_address (inet)
- user_agent (text)
```

### Modified Tables

#### Update `members` table
- Add `kyc_status` (enum: pending, verified, rejected)
- Add `kyc_level` (enum: basic, intermediate, full)
- Add `email` (text)
- Add `civil_status` (text)
- Add `nationality` (text)

## Phase 2: Frontend Implementation

### Technology Stack
- **Form Management**: React Hook Form + Zod validation
- **State Management**: Zustand for multi-step form state
- **Face Recognition**: face-api.js or AWS Rekognition
- **File Upload**: react-dropzone
- **Progress Tracking**: Custom stepper component
- **UI Components**: Shadcn/ui + Tailwind CSS

### Pages Structure
```
/signup
  /step-1-mobile      - Mobile number + OTP
  /step-2-pin         - PIN creation
  /step-3-personal    - Basic personal info
  /step-4-contact     - Contact information
  /step-5-address     - Address details
  /step-6-identity    - KYC verification
  /step-7-business    - Business information
  /step-8-financial   - Financial details
  /step-9-guarantor   - Guarantor (optional)
  /step-10-documents  - Document upload
  /step-11-consent    - Legal consent
  /complete           - Success page

/legal
  /terms-and-conditions
  /privacy-policy
  /data-privacy-consent
  /credit-investigation-authorization
```

### Key Features
1. **Auto-save**: Save progress after each step
2. **Resume**: Allow users to continue from where they left off
3. **Validation**: Real-time validation with clear error messages
4. **Progress Bar**: Visual progress indicator
5. **Mobile Responsive**: Optimized for mobile devices
6. **Accessibility**: WCAG 2.1 AA compliant

## Phase 3: Backend Implementation

### Server Actions
```typescript
// Phone verification
- sendOTP(phoneNumber)
- verifyOTP(phoneNumber, code)
- checkPhoneExists(phoneNumber)

// KYC application
- createKYCApplication(data)
- updateKYCStep(applicationId, step, data)
- getKYCApplication(userId)
- submitKYCForReview(applicationId)

// Face verification
- uploadSelfie(file)
- verifyFaceMatch(selfieUrl, idUrl)

// Document management
- uploadDocument(file, type)
- getDocuments(memberId)

// Legal consent
- recordConsent(userId, consentType, version)
- getConsents(userId)
```

### API Integrations
1. **Twilio Verify**: OTP verification (already configured)
2. **Face Recognition**: 
   - Option A: face-api.js (client-side, free)
   - Option B: AWS Rekognition (server-side, paid)
   - Option C: Azure Face API (server-side, paid)
3. **Address Validation**: Philippine address API
4. **ID Verification**: OCR for ID extraction

## Phase 4: Security & Compliance

### Data Protection
- Encrypt sensitive data at rest
- Use HTTPS for all communications
- Implement rate limiting
- Add CAPTCHA for bot protection
- Audit logging for all KYC actions

### Privacy Compliance
- Data retention policies
- Right to be forgotten
- Data portability
- Consent management
- Privacy by design

## Phase 5: Admin Dashboard

### KYC Review Interface
- Pending applications queue
- Document viewer with zoom
- Face match verification
- Approve/reject workflow
- Bulk actions
- Export reports

## Implementation Timeline

### Week 1: Database & Backend
- Day 1-2: Database schema migration
- Day 3-4: Server actions implementation
- Day 5: Testing & validation

### Week 2: Frontend Core
- Day 1-2: Multi-step form structure
- Day 3-4: Steps 1-6 implementation
- Day 5: Testing & refinement

### Week 3: Frontend Advanced
- Day 1-2: Steps 7-11 implementation
- Day 3: Face recognition integration
- Day 4: Legal pages
- Day 5: Testing & refinement

### Week 4: Integration & Polish
- Day 1-2: End-to-end testing
- Day 3: Admin dashboard updates
- Day 4: Performance optimization
- Day 5: Documentation & deployment

## Success Metrics
- KYC completion rate > 80%
- Average completion time < 15 minutes
- Face match accuracy > 95%
- Zero data breaches
- 100% regulatory compliance

## Next Steps
1. Review and approve this plan
2. Start with Phase 1: Database schema
3. Implement incrementally
4. Test thoroughly at each phase
5. Deploy to production

---

**Note**: This is an enterprise-grade implementation. Each phase will be built with production-ready code, proper error handling, logging, and monitoring.
