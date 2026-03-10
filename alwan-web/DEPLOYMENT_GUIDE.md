# Alwan KYC System - Deployment Guide

## Prerequisites

### 1. Supabase Setup
- Supabase project created
- Database accessible
- Storage enabled
- Auth configured

### 2. Twilio Verify
- Twilio account created
- Verify service configured in Supabase
- Phone number purchased (for production)

### 3. Environment Variables
Create `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Step-by-Step Deployment

### Step 1: Database Migration
```bash
# Connect to your Supabase database
psql -h db.your-project.supabase.co -U postgres -d postgres

# Run the KYC migration
\i supabase/migrations/20240310_create_kyc_tables.sql

# Verify tables created
\dt public.*
```

### Step 2: Storage Bucket Setup
```sql
-- Create member-documents bucket (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('member-documents', 'member-documents', false);

-- Set up storage policies
CREATE POLICY "Authenticated users can upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'member-documents');

CREATE POLICY "Users can view their own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'member-documents');
```

### Step 3: Face-API Models
```bash
# Download models
mkdir -p public/models
cd public/models

# Download from: https://github.com/justadudewhohacks/face-api.js-models
# Required models:
# - tiny_face_detector_model-weights_manifest.json
# - tiny_face_detector_model-shard1
# - face_landmark_68_model-weights_manifest.json
# - face_landmark_68_model-shard1
# - face_recognition_model-weights_manifest.json
# - face_recognition_model-shard1 & shard2
# - ssd_mobilenetv1_model-weights_manifest.json
# - ssd_mobilenetv1_model-shard1 & shard2
```

### Step 4: Install Dependencies
```bash
cd alwan-web
npm install
```

### Step 5: Build Application
```bash
npm run build
```

### Step 6: Test Locally
```bash
npm run dev
# Visit http://localhost:3000/signup
```

### Step 7: Deploy to Production

#### Option A: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
```

#### Option B: Docker
```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

```bash
# Build and run
docker build -t alwan-web .
docker run -p 3000:3000 --env-file .env.local alwan-web
```

## Post-Deployment Checklist

### 1. Verify Database
- [ ] All tables created
- [ ] RLS policies active
- [ ] Triggers working
- [ ] Indexes created

### 2. Test Authentication
- [ ] OTP sending works
- [ ] OTP verification works
- [ ] User creation successful

### 3. Test File Upload
- [ ] Storage bucket accessible
- [ ] File upload works
- [ ] File retrieval works
- [ ] RLS policies enforced

### 4. Test Face Recognition
- [ ] Models loaded successfully
- [ ] Face detection works
- [ ] Face comparison works
- [ ] Similarity scoring accurate

### 5. Test Complete Flow
- [ ] Step 1: Mobile number
- [ ] Step 2: OTP verification
- [ ] Step 3: PIN creation
- [ ] Step 4: Personal info
- [ ] Step 5: Contact info
- [ ] Step 6: Address
- [ ] Step 7: Identity + face match
- [ ] Step 8: Business info
- [ ] Step 9: Financial info
- [ ] Step 10: Guarantor (optional)
- [ ] Step 11: Documents
- [ ] Step 12: Legal consents
- [ ] Completion page shows

### 6. Test Data Persistence
- [ ] Form data saves between steps
- [ ] Can resume from any step
- [ ] Completed steps tracked
- [ ] Data persists after refresh

### 7. Test Responsive Design
- [ ] Mobile (320px - 767px)
- [ ] Tablet (768px - 1023px)
- [ ] Desktop (1024px+)
- [ ] All animations smooth

### 8. Test Error Handling
- [ ] Network errors handled
- [ ] Validation errors shown
- [ ] File upload errors handled
- [ ] Face match failures handled

## Monitoring & Maintenance

### Key Metrics to Track
1. **Conversion Rates**
   - Step completion rates
   - Drop-off points
   - Overall completion rate

2. **Performance**
   - Page load times
   - API response times
   - Face recognition speed

3. **Errors**
   - OTP failures
   - Upload failures
   - Face match failures
   - Validation errors

### Logging
```typescript
// Add to server actions
console.log('[KYC] Step completed:', { step, userId, timestamp })
console.error('[KYC] Error:', { error, step, userId })
```

### Database Queries for Monitoring
```sql
-- Applications by status
SELECT status, COUNT(*) 
FROM kyc_applications 
GROUP BY status;

-- Completion rate by step
SELECT current_step, COUNT(*) 
FROM kyc_applications 
WHERE status = 'pending'
GROUP BY current_step;

-- Face match success rate
SELECT 
  COUNT(*) FILTER (WHERE face_match_verified = true) * 100.0 / COUNT(*) as success_rate
FROM member_identifications;

-- Recent applications
SELECT 
  ka.mobile_number,
  ka.status,
  ka.current_step,
  ka.created_at
FROM kyc_applications ka
ORDER BY ka.created_at DESC
LIMIT 20;
```

## Troubleshooting

### Issue: OTP not received
**Solution:**
1. Check Twilio Verify configuration in Supabase
2. Verify phone number format (+63XXXXXXXXXX)
3. Check Twilio account balance
4. Review Twilio logs

### Issue: Face match always fails
**Solution:**
1. Ensure models are in `/public/models/`
2. Check browser console for errors
3. Verify image quality (lighting, clarity)
4. Test with different images

### Issue: File upload fails
**Solution:**
1. Check storage bucket exists
2. Verify RLS policies
3. Check file size (<5MB)
4. Verify file type (image/*, application/pdf)

### Issue: Form data not persisting
**Solution:**
1. Check localStorage is enabled
2. Verify Zustand persistence config
3. Check browser console for errors
4. Clear localStorage and retry

### Issue: Slow performance
**Solution:**
1. Optimize images (use WebP)
2. Reduce animation complexity
3. Implement code splitting
4. Enable caching
5. Use CDN for static assets

## Security Considerations

### 1. Environment Variables
- Never commit `.env.local`
- Use different keys for dev/prod
- Rotate keys regularly

### 2. RLS Policies
- Test all policies thoroughly
- Ensure users can only access their data
- Admin access properly restricted

### 3. File Upload
- Validate file types server-side
- Scan for malware
- Limit file sizes
- Use signed URLs

### 4. Rate Limiting
```typescript
// Add to server actions
import { rateLimit } from '@/lib/rate-limit'

export async function sendOTP(phone: string) {
  const { success } = await rateLimit.check(phone)
  if (!success) {
    return { error: 'Too many requests' }
  }
  // ... rest of code
}
```

### 5. Input Validation
- Always validate on server-side
- Sanitize user inputs
- Use parameterized queries
- Implement CSRF protection

## Backup & Recovery

### Database Backups
```bash
# Automated daily backups (Supabase handles this)
# Manual backup
pg_dump -h db.your-project.supabase.co -U postgres -d postgres > backup.sql

# Restore
psql -h db.your-project.supabase.co -U postgres -d postgres < backup.sql
```

### Storage Backups
```bash
# Use Supabase CLI or API to backup storage
supabase storage download member-documents --recursive
```

## Support

### Technical Issues
- Email: dev@alwan.ph
- Slack: #alwan-tech

### User Support
- Email: support@alwan.ph
- Phone: +63 XXX XXX XXXX

## Version History

- **v1.0.0** (March 10, 2026) - Initial KYC system release
  - 12-step signup flow
  - Face recognition
  - Philippine compliance
  - Mobile-first design

---

**Last Updated**: March 10, 2026
**Maintained By**: Alwan Development Team
