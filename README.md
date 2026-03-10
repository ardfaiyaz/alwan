# Alwan Microfinance Platform

A comprehensive digital microfinance platform built for the Philippines, providing accessible financial services to underserved communities through technology.

## 🌟 Overview

Alwan is a modern microfinance platform that combines mobile-first design with robust KYC (Know Your Customer) compliance, enabling Filipino entrepreneurs and small business owners to access microloans, savings programs, and financial services.

## 📁 Project Structure

```
alwan/
├── alwan-web/          # Next.js web application
├── alwan-mobile/       # React Native mobile app
└── README.md          # This file
```

## 🚀 Features

### Core Services
- **Microloans**: Quick access to business loans with flexible terms
- **Savings Programs**: Secure savings accounts with competitive rates
- **Group Lending**: Community-based lending circles
- **Microinsurance**: Affordable insurance products
- **Digital Payments**: Seamless payment processing

### Platform Features
- **Complete KYC System**: 12-step verification process compliant with BSP regulations
- **Face Verification**: Browser-based biometric verification using face-api.js
- **Multi-language Support**: English and Filipino
- **Responsive Design**: Mobile-first approach for all devices
- **Real-time Notifications**: Toast notifications for user feedback
- **Role-based Access Control**: Admin, staff, and member roles

## 🛠️ Technology Stack

### Web Application (alwan-web)
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, Framer Motion
- **Authentication**: Supabase Auth with Twilio OTP
- **Database**: PostgreSQL (Supabase)
- **Storage**: Supabase Storage
- **Face Recognition**: face-api.js (client-side)
- **Form Validation**: Zod + React Hook Form
- **State Management**: Zustand
- **Monitoring**: Sentry

### Mobile Application (alwan-mobile)
- **Framework**: React Native (Expo)
- **Navigation**: Expo Router
- **Language**: TypeScript

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Git
- Supabase account
- Twilio account (for OTP)
- Sentry account (optional, for monitoring)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/alwan.git
cd alwan
```

### 2. Web Application Setup

```bash
cd alwan-web
npm install
```

Create `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Sentry (optional)
SENTRY_AUTH_TOKEN=your_sentry_token
```

Run development server:

```bash
npm run dev
```

Visit `http://localhost:3000`

### 3. Mobile Application Setup

```bash
cd alwan-mobile
npm install
npx expo start
```

## 📱 Key Features Documentation

### KYC Signup Flow

The platform implements a comprehensive 12-step KYC process:

1. **Mobile Verification**: Phone number validation with OTP
2. **OTP Verification**: 6-digit code confirmation
3. **Security PIN**: 5-digit PIN creation
4. **Personal Details**: Name, DOB, gender, civil status
5. **Contact Information**: Email and alternate phone
6. **Address Details**: Complete Philippine address
7. **Identity Verification**: ID upload with face matching
8. **Business Information**: Business details and registration
9. **Financial Information**: Income, expenses, assets
10. **Guarantor Details**: Optional guarantor information
11. **Document Upload**: Utility bills and permits
12. **Legal Agreements**: Terms, privacy, and consents

### Face Verification

- **Technology**: face-api.js (100% free, client-side)
- **Models**: Loaded from CDN, no backend required
- **Process**: Compare ID photo with live selfie
- **Threshold**: 60% similarity for match
- **Compliance**: Meets BSP biometric requirements

### Authentication

- **Primary**: Supabase Auth with phone number
- **OTP**: Twilio Verify integration
- **Session**: Persistent across signup flow
- **Security**: PIN-based transaction authorization

## 🏗️ Architecture

### Database Schema

Key tables:
- `members`: User profiles and KYC status
- `member_profiles`: Extended profile information
- `member_addresses`: Address details
- `member_businesses`: Business information
- `member_financial_info`: Financial data
- `member_documents`: Document storage references
- `legal_consents`: Consent tracking
- `kyc_applications`: Application workflow

### File Structure

```
alwan-web/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── (auth)/            # Auth-related pages
│   │   ├── (onboarding)/      # Onboarding flow
│   │   ├── (tabs)/            # Main app tabs
│   │   ├── signup/            # KYC signup flow
│   │   ├── legal/             # Legal documents
│   │   └── admin/             # Admin dashboard
│   ├── components/            # React components
│   │   ├── kyc/              # KYC step components
│   │   ├── layout/           # Layout components
│   │   └── ui/               # UI components
│   ├── lib/                   # Utilities and configs
│   │   ├── supabase/         # Supabase client
│   │   ├── validations/      # Zod schemas
│   │   ├── store/            # Zustand stores
│   │   └── utils/            # Helper functions
│   └── styles/               # Global styles
├── public/                    # Static assets
└── supabase/                 # Database migrations
```

## 🔒 Security & Compliance

### Regulatory Compliance
- **BSP (Bangko Sentral ng Pilipinas)**: Microfinance regulations
- **SEC (Securities and Exchange Commission)**: Corporate compliance
- **Data Privacy Act of 2012**: Personal data protection
- **AMLA (Anti-Money Laundering Act)**: AML requirements

### Security Features
- End-to-end encryption for sensitive data
- Secure file storage with access controls
- Rate limiting on OTP requests
- Session management and timeout
- Input validation and sanitization
- HTTPS-only communication

## 🧪 Testing

### Development Testing
- Use verified phone numbers in Twilio trial
- Space out OTP requests (avoid rate limiting)
- Test complete flow without page refresh
- Clear browser cache between tests

### Known Limitations
- Twilio trial: Verified numbers only
- Session persistence: No page refresh during signup
- Face verification: Requires good lighting and clear photos

## 📚 Additional Documentation

- [Face Verification Guide](alwan-web/FACE_VERIFICATION_GUIDE.md)
- [Web Application README](alwan-web/README.md)
- [API Documentation](docs/API.md) (coming soon)
- [Deployment Guide](docs/DEPLOYMENT.md) (coming soon)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential.

## 👥 Team

Developed by the Alwan Development Team

## 📞 Support

For support, email support@alwan.ph or visit our help center.

## 🗺️ Roadmap

- [ ] Mobile app launch
- [ ] Loan calculator
- [ ] Payment gateway integration
- [ ] SMS notifications
- [ ] Multi-language support (Tagalog, Cebuano)
- [ ] Offline mode for mobile
- [ ] Advanced analytics dashboard
- [ ] API for third-party integrations

## ⚠️ Important Notes

### Twilio OTP Issues
If you encounter "phone number blocked" errors:
- Wait 24 hours for automatic unblock
- Use different phone numbers for testing
- Implement rate limiting in production
- Consider upgrading to paid Twilio account

### Session Management
- Complete signup flow without refreshing page
- Session expires if page is refreshed
- Store userId after OTP verification
- Check authentication before final submission

---

**Built with ❤️ for Filipino entrepreneurs**
