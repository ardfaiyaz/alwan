# Signup Flow Documentation

## Overview

The Alwan signup process is a comprehensive 12-step KYC (Know Your Customer) flow that collects all necessary information from applicants before they can become members. The data is stored securely and processed after admin approval and center assignment.

## Architecture

### Data Flow

```
User Signup → KYC Application (with metadata) → Admin Review → Center Assignment → Member Creation
```

### Key Components

1. **Frontend**: Multi-step form in `/signup` page
2. **State Management**: Zustand store (`kyc-store.ts`)
3. **Backend Actions**: Server actions in `actions/kyc.ts`
4. **Database**: Supabase with PostgreSQL
5. **File Storage**: Supabase Storage for document uploads

## Database Schema

### Primary Tables

#### `kyc_applications`
Stores the complete KYC application with all form data in a JSONB metadata column.

```sql
- id: uuid (PK)
- user_id: uuid (FK to auth.users)
- mobile_number: text (unique)
- status: enum (pending, in_review, approved, rejected)
- current_step: integer
- completed_steps: jsonb
- kyc_level: enum (basic, full)
- metadata: jsonb -- NEW: Stores all form data
- rejection_reason: text
- approved_by: uuid
- approved_at: timestamp
- submitted_at: timestamp
- created_at: timestamp
- updated_at: timestamp
```

#### Metadata Structure

The `metadata` column contains:

```json
{
  "firstName": "string",
  "middleName": "string",
  "lastName": "string",
  "dateOfBirth": "date",
  "gender": "string",
  "civilStatus": "string",
  "nationality": "string",
  "mothersMaidenName": "string",
  "numberOfDependents": "number",
  "email": "string",
  "mobileNumber": "string",
  "alternatePhone": "string",
  "address": {
    "houseNumber": "string",
    "street": "string",
    "barangay": "string",
    "city": "string",
    "province": "string",
    "zipCode": "string",
    "yearsLiving": "number",
    "housingType": "string"
  },
  "identity": {
    "idType": "string",
    "idNumber": "string",
    "idFrontUrl": "string",
    "idBackUrl": "string",
    "selfieUrl": "string",
    "faceMatchScore": "number"
  },
  "business": {
    "businessName": "string",
    "businessType": "string",
    "businessAddress": "string",
    "yearsOperating": "number",
    "registrationType": "string",
    "registrationNumber": "string",
    "dailySales": "number",
    "monthlyRevenue": "number",
    "numberOfEmployees": "number"
  },
  "financial": {
    "monthlyIncome": "number",
    "otherIncomeSources": "string",
    "monthlyExpenses": "number",
    "existingLoans": "array",
    "assets": "array"
  },
  "guarantor": {
    "fullName": "string",
    "relationship": "string",
    "address": "string",
    "phone": "string",
    "occupation": "string",
    "idUrl": "string"
  },
  "documents": {
    "utilityBillUrl": "string",
    "businessPermitUrl": "string"
  },
  "consents": {
    "termsAccepted": "boolean",
    "privacyAccepted": "boolean",
    "dataPrivacyAccepted": "boolean",
    "creditInvestigationAccepted": "boolean"
  }
}
```

## Signup Steps

### Step 1: Mobile Number & OTP Verification
- User enters Philippine mobile number
- OTP sent via Twilio (Supabase Auth)
- User verifies OTP
- Creates authenticated session
- Stores `userId` in form data

### Step 2: PIN Setup
- User creates 6-digit PIN
- PIN is hashed and stored securely
- Used for future authentication

### Step 3: Personal Information
- First name, middle name, last name
- Date of birth
- Gender
- Civil status
- Nationality
- Mother's maiden name
- Number of dependents

### Step 4: Contact Information
- Email address
- Alternate phone number

### Step 5: Address Information
- House number
- Street
- Barangay
- City
- Province
- ZIP code
- Years living at address
- Housing type (owned/renting/living with family)

### Step 6: Identity Verification
- ID type selection
- ID number
- ID front photo upload
- ID back photo upload
- Selfie photo upload
- Face matching verification (using face-api.js)

### Step 7: Business Information
- Business name
- Business type
- Business address
- Years operating
- Registration type (DTI/Barangay/SEC/None)
- Registration number
- Daily sales
- Monthly revenue
- Number of employees

### Step 8: Financial Information
- Monthly income
- Other income sources
- Monthly expenses
- Existing loans (array)
- Assets (array)

### Step 9: Guarantor Information (Optional)
- Full name
- Relationship
- Address
- Phone number
- Occupation
- ID document upload

### Step 10: Documents Upload
- Utility bill (proof of billing)
- Business permit

### Step 11: Review
- Summary of all entered information
- Ability to go back and edit

### Step 12: Legal Consents
- Terms and Conditions
- Privacy Policy
- Data Privacy Consent (DPA 2012)
- Credit Investigation Authorization
- Final submission

## File Upload Process

### Storage Structure
```
member-documents/
  └── kyc/
      └── {user_id}/
          ├── identity/
          │   ├── id_front.jpg
          │   ├── id_back.jpg
          │   └── selfie.jpg
          ├── guarantor/
          │   └── guarantor_id.jpg
          └── documents/
              ├── utility_bill.pdf
              └── business_permit.pdf
```

### Upload Flow
1. File selected by user
2. Validated on client (size, type)
3. Uploaded to Supabase Storage via server action
4. Public URL returned and stored in metadata
5. Files are accessible for admin review

## Submission Process

### What Happens on Submit

1. **Authentication Check**
   - Verifies user session is still valid
   - Returns error if session expired

2. **File Uploads**
   - All selected files are uploaded to Supabase Storage
   - URLs are collected for metadata

3. **KYC Application Creation/Update**
   - Creates or updates `kyc_applications` record
   - Stores all form data in `metadata` JSONB column
   - Sets status to `in_review`
   - Records submission timestamp

4. **Profile Creation**
   - Creates basic profile in `profiles` table
   - Links to `auth.users` via user_id

5. **Legal Consents Recording**
   - Records each accepted consent in `legal_consents` table
   - Stores version, timestamp, IP address

6. **Success Response**
   - Returns success message
   - Redirects to completion page
   - Clears form data from local storage

### Why Not Create Member Record Immediately?

The `members` table requires a `center_id` (NOT NULL), but during signup:
- User hasn't selected a center yet
- Admin needs to review and approve application
- Admin assigns appropriate center based on location/availability

Therefore, we store all data in `kyc_applications.metadata` and create the full member record later.

## Admin Approval Process

### Review KYC Application

Admins can view pending applications using the `kyc_applications_view`:

```sql
SELECT * FROM kyc_applications_view 
WHERE status = 'in_review'
ORDER BY submitted_at DESC;
```

### Approve and Create Member

When admin approves an application:

1. **Assign Center**
   - Admin selects appropriate center
   - Based on applicant's location and center capacity

2. **Create Member Record**
   - Call `createMemberFromKYC()` server action
   - Extracts data from `metadata`
   - Creates records in:
     - `members`
     - `member_profiles`
     - `member_addresses`
     - `member_identifications`
     - `member_businesses`
     - `member_financial_info`
     - `member_guarantors` (if provided)
     - `member_documents`

3. **Update KYC Status**
   - Sets `status` to `approved`
   - Records `approved_by` and `approved_at`

4. **Notify User**
   - Send email/SMS notification
   - User can now log in and access member features

### Reject Application

If application is rejected:

1. Call `rejectKYCApplication()` server action
2. Provide rejection reason
3. Update status to `rejected`
4. Notify user with reason
5. User can resubmit with corrections

## Security Considerations

### Authentication
- OTP verification via Twilio
- Session management via Supabase Auth
- Session expiry detection and handling

### Data Protection
- All sensitive data encrypted at rest
- File uploads scanned for malware
- HTTPS for all communications
- Row Level Security (RLS) policies on all tables

### Privacy Compliance
- Data Privacy Act of 2012 compliance
- Explicit consent collection
- Right to access and deletion
- Audit trail of all data access

## Error Handling

### Common Errors

1. **Session Expired**
   - Detected in LegalConsentsStep
   - Shows alert to user
   - Redirects to start of signup
   - Clears form data

2. **File Upload Failed**
   - Retries upload automatically
   - Shows specific error message
   - Allows user to retry

3. **Twilio Errors**
   - 60410: Phone number blocked (fraud detection)
   - 21608: Unverified number (trial account)
   - 21211: Invalid phone number
   - 60200: Rate limit exceeded

4. **Database Errors**
   - Duplicate mobile number
   - Invalid data format
   - Constraint violations

## Testing

### Test Accounts

For development/testing:
- Use verified phone numbers in Twilio
- Test with various ID types
- Test with/without guarantor
- Test file upload limits

### Test Scenarios

1. Complete signup flow
2. Session expiry during signup
3. File upload failures
4. Invalid data validation
5. Face matching verification
6. Admin approval process
7. Admin rejection process

## Future Enhancements

1. **Email Verification**
   - Add email OTP verification
   - Backup authentication method

2. **Document OCR**
   - Automatic ID data extraction
   - Reduce manual data entry

3. **Credit Scoring**
   - Automated credit assessment
   - Integration with credit bureaus

4. **Video KYC**
   - Live video verification
   - Enhanced fraud prevention

5. **Mobile App**
   - Native mobile experience
   - Biometric authentication

## Troubleshooting

### User Can't Receive OTP
- Check phone number format (+63XXXXXXXXXX)
- Verify Twilio account status
- Check for blocked numbers
- Try alternate phone number

### Session Expires During Signup
- Complete signup in one session
- Don't refresh page during process
- Check internet connection stability

### File Upload Fails
- Check file size (max 10MB)
- Verify file format (JPG, PNG, PDF)
- Check internet connection
- Try different browser

### Face Matching Fails
- Ensure good lighting
- Face clearly visible
- No glasses/mask
- Match ID photo angle

## Support

For technical issues:
- Check browser console for errors
- Review server logs in Supabase
- Contact support with application ID
- Provide screenshots if possible

## Conclusion

This signup flow provides a comprehensive KYC process that:
- Collects all necessary information
- Ensures data security and privacy
- Allows for admin review and approval
- Creates complete member records
- Complies with Philippine regulations
- Provides excellent user experience
