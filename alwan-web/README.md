# Alwan Web Application

The web platform for Alwan Microfinance - a Next.js application providing comprehensive financial services to Filipino entrepreneurs.

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Environment Setup

Create `.env.local` in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Sentry Configuration (Optional)
SENTRY_AUTH_TOKEN=your_sentry_auth_token
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
alwan-web/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                  # Authentication pages
│   │   │   ├── login.tsx
│   │   │   ├── signup.tsx
│   │   │   └── forgot-password.tsx
│   │   ├── signup/                  # KYC Signup Flow
│   │   │   ├── page.tsx            # Main signup page with 12 steps
│   │   │   ├── layout.tsx          # Signup layout with metadata
│   │   │   ├── loading.tsx         # Loading skeleton
│   │   │   └── complete/           # Success page
│   │   ├── legal/                   # Legal Documents
│   │   │   ├── privacy-policy/
│   │   │   ├── terms-and-conditions/
│   │   │   ├── data-privacy-consent/
│   │   │   └── credit-investigation-authorization/
│   │   ├── admin/                   # Admin Dashboard
│   │   ├── about/                   # About page
│   │   ├── services/                # Services page
│   │   ├── faq/                     # FAQ page
│   │   └── page.tsx                 # Homepage
│   ├── components/
│   │   ├── kyc/                     # KYC Components
│   │   │   └── steps/              # 12 KYC Step Components
│   │   │       ├── MobileStep.tsx
│   │   │       ├── OTPStep.tsx
│   │   │       ├── PINStep.tsx
│   │   │       ├── PersonalInfoStep.tsx
│   │   │       ├── ContactInfoStep.tsx
│   │   │       ├── AddressStep.tsx
│   │   │       ├── IdentityStep.tsx
│   │   │       ├── BusinessStep.tsx
│   │   │       ├── FinancialStep.tsx
│   │   │       ├── GuarantorStep.tsx
│   │   │       ├── DocumentsStep.tsx
│   │   │       └── LegalConsentsStep.tsx
│   │   ├── layout/                  # Layout Components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── ConditionalLayout.tsx
│   │   └── ui/                      # UI Components
│   │       ├── LoginModal.tsx
│   │       ├── SignupModal.tsx
│   │       ├── ConfirmModal.tsx
│   │       ├── ErrorModal.tsx
│   │       └── SuccessModal.tsx
│   ├── lib/
│   │   ├── supabase/               # Supabase Configuration
│   │   │   ├── client.ts           # Client-side Supabase
│   │   │   └── server.ts           # Server-side Supabase
│   │   ├── validations/            # Zod Validation Schemas
│   │   │   └── kyc-schemas.ts
│   │   ├── store/                  # Zustand State Management
│   │   │   └── kyc-store.ts
│   │   ├── utils/                  # Utility Functions
│   │   │   └── face-verification.ts
│   │   ├── constants/              # Constants
│   │   │   └── philippines.ts
│   │   └── rbac/                   # Role-Based Access Control
│   │       └── permissions.ts
│   └── styles/
│       └── globals.css             # Global Tailwind styles
├── public/
│   ├── icons/                      # App icons and logos
│   └── images/                     # Static images
├── supabase/
│   └── migrations/                 # Database migrations
├── next.config.ts                  # Next.js configuration
├── tailwind.config.ts              # Tailwind configuration
├── tsconfig.json                   # TypeScript configuration
└── package.json                    # Dependencies
```

## 🎨 Features

### KYC Signup System
- **12-Step Process**: Comprehensive user verification
- **Real-time Validation**: Zod schemas with React Hook Form
- **Progress Tracking**: Visual step indicator
- **State Persistence**: Zustand with localStorage
- **Responsive Design**: Mobile-first approach (xs to lg breakpoints)

### Face Verification
- **Technology**: face-api.js (100% free, client-side)
- **No Backend Required**: Models loaded from CDN
- **Privacy-First**: All processing in browser
- **High Accuracy**: 60% similarity threshold
- **See**: [FACE_VERIFICATION_GUIDE.md](./FACE_VERIFICATION_GUIDE.md)

### Authentication
- **Provider**: Supabase Auth
- **OTP**: Twilio Verify integration
- **Phone-based**: Philippine mobile numbers (+63)
- **Session Management**: Persistent across signup flow
- **Security**: 5-digit PIN for transactions

### UI/UX
- **Design System**: Consistent white backgrounds with emerald accents
- **Animations**: Framer Motion for smooth transitions
- **Notifications**: Sonner toast notifications
- **Loading States**: Skeleton screens for all pages
- **Error Handling**: User-friendly error messages

## 🔧 Configuration

### Next.js Config

```typescript
// next.config.ts
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Fix for face-api.js in browser
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        crypto: false,
      }
    }
    return config
  },
}
```

### Tailwind Config

Brand colors:
- Primary: `#4dd88f` (Light Emerald)
- Secondary: `#009245` (Emerald)
- Accent: `#056633` (Dark Emerald)

### TypeScript

Strict mode enabled with path aliases:
- `@/*` → `./src/*`

## 📦 Dependencies

### Core
- `next`: 15.1.4
- `react`: 19.0.0
- `typescript`: 5.7.2

### UI & Styling
- `tailwindcss`: 3.4.17
- `framer-motion`: 11.15.0
- `lucide-react`: 0.469.0
- `sonner`: 1.7.3

### Forms & Validation
- `react-hook-form`: 7.54.2
- `zod`: 3.24.1
- `@hookform/resolvers`: 3.9.1

### Backend & Auth
- `@supabase/supabase-js`: 2.47.10
- `@supabase/ssr`: 0.5.2

### Face Recognition
- `face-api.js`: 0.22.2

### State Management
- `zustand`: 5.0.2

### Monitoring
- `@sentry/nextjs`: 8.46.0

## 🎯 Key Pages

### Homepage (`/`)
- Hero section with CTA
- Services overview
- About section
- Contact information

### Signup (`/signup`)
- 12-step KYC process
- Vertical carousel navigation
- Real-time validation
- Face verification
- Document upload

### Legal Pages (`/legal/*`)
- Privacy Policy
- Terms and Conditions
- Data Privacy Consent
- Credit Investigation Authorization

### Admin Dashboard (`/admin`)
- Application approvals
- Member management
- Document verification
- Analytics

## 🔐 Security

### Data Protection
- HTTPS-only in production
- Encrypted file storage
- Secure session management
- Input sanitization
- XSS protection

### Compliance
- BSP regulations
- SEC requirements
- Data Privacy Act 2012
- AMLA compliance

## 🧪 Testing

### Manual Testing Checklist

```bash
# 1. Test signup flow
- Enter phone number
- Verify OTP
- Create PIN
- Fill all 12 steps
- Submit application

# 2. Test face verification
- Upload clear ID photo
- Take clear selfie
- Verify match (>60%)

# 3. Test responsive design
- Mobile (320px - 640px)
- Tablet (640px - 1024px)
- Desktop (1024px+)

# 4. Test error handling
- Invalid inputs
- Network errors
- Session expiry
```

### Known Issues

1. **Twilio Rate Limiting**
   - Symptom: "Phone number blocked" error
   - Solution: Wait 24 hours or use different number
   - Prevention: Space out OTP requests

2. **Session Persistence**
   - Symptom: "User not authenticated" on submit
   - Solution: Complete flow without page refresh
   - Fix: Session stored after OTP verification

3. **Face Verification**
   - Requirement: Good lighting and clear photos
   - Minimum: 200x200px images
   - Threshold: 60% similarity

## 📊 Performance

### Lighthouse Scores (Target)
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

### Optimization
- Image optimization with Next.js Image
- Code splitting with dynamic imports
- CSS optimization with Tailwind
- Font optimization with next/font

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod
```

### Environment Variables

Set in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SENTRY_AUTH_TOKEN`

### Build Command

```bash
npm run build
```

### Output Directory

```
.next
```

## 🐛 Troubleshooting

### Webpack Errors

```bash
# Clear cache
rm -rf .next
npm run dev
```

### Supabase Connection

```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Face-api.js Issues

```bash
# Restart dev server after config changes
npm run dev
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [face-api.js](https://github.com/justadudewhohacks/face-api.js)
- [Framer Motion](https://www.framer.com/motion/)

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit PR with description

## 📄 License

Proprietary - All rights reserved

---

**For detailed face verification documentation, see [FACE_VERIFICATION_GUIDE.md](./FACE_VERIFICATION_GUIDE.md)**
