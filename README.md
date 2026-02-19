# Alwan – Microfinance for Every Filipino

Alwan is a modern microfinance ecosystem designed to empower Filipinos with accessible, AI-powered financial services. This monorepo contains the complete codebase for the Alwan platform, including its public web portal, mobile application, and administrative dashboard.

---

## 📁 Project Structure

```
alwan/
├── alwan-web/          # Next.js 15 Public Web Portal
│   ├── src/
│   │   ├── app/        # App Router pages and API routes
│   │   ├── components/ # Reusable React components
│   │   └── lib/        # Utilities, hooks, and configurations
│   ├── public/         # Static assets (images, icons)
│   └── package.json
├── alwan-mobile/       # React Native Expo Mobile App
│   ├── app/            # Expo Router screens
│   ├── components/     # Mobile UI components
│   ├── assets/         # Mobile assets (fonts, images)
│   └── package.json
├── alwan-admin/        # Next.js 15 Admin Dashboard
│   ├── src/
│   │   ├── app/        # Admin pages and routes
│   │   ├── components/ # Admin-specific components
│   │   └── lib/        # Admin utilities and helpers
│   ├── public/         # Admin static assets
│   └── package.json
├── package.json        # Root monorepo configuration
├── .editorconfig       # Code style configuration
└── README.md           # This file
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Git** for version control
- **Expo CLI** (for mobile development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ardfaiyaz/alwan.git
   cd alwan
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install dependencies for each project**
   ```bash
   cd alwan-web && npm install && cd ..
   cd alwan-mobile && npm install && cd ..
   cd alwan-admin && npm install && cd ..
   ```

---

## 🎯 Available Scripts

The root `package.json` provides convenient shortcuts to run all projects:

### Development Scripts

| Command | Description | Port |
|---------|-------------|------|
| `npm run web` | Start web portal in development mode | 3000 |
| `npm run mobile` | Start mobile app with Expo | - |
| `npm run mobile:web` | Start mobile app in web browser | 19006 |
| `npm run admin` | Start admin dashboard in development mode | 3001 |
| `npm run dev:all` | Run all three projects concurrently | 3000, 19006, 3001 |
| `npm run dev:web` | Start web portal (alternative) | Default |
| `npm run dev:mobile` | Start mobile app (alternative) | - |
| `npm run dev:admin` | Start admin dashboard (alternative) | Default |

### Build Scripts

| Command | Description |
|---------|-------------|
| `npm run build:web` | Build web portal for production |
| `npm run build:mobile` | Build mobile app for production |
| `npm run build:admin` | Build admin dashboard for production |

### Example Usage

```bash
# Run all projects at once (recommended for full-stack development)
npm run dev:all

# Run only the web portal
npm run web

# Run only the admin dashboard
npm run admin

# Run mobile app
npm run mobile
```

---

## 🏗️ Component Overview

### 1. **alwan-web** – Public Web Portal

The customer-facing website showcasing Alwan's services and features.

**Technology Stack:**
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS 3.4
- **Animations**: Framer Motion 12.34
- **UI Components**: Radix UI primitives
- **Forms**: React Hook Form + Zod validation
- **State Management**: Zustand 5.0
- **Data Fetching**: TanStack Query 5.90
- **Auth/Database**: Supabase (SSR + Client)
- **Charts**: Recharts 3.7
- **Notifications**: Sonner 2.0

**Key Features:**
- Landing page with hero section and feature showcase
- About page with team information
- Responsive design with mobile-first approach
- Dark mode with signature Alwan theme
- Glassmorphism and gradient effects

**Development:**
```bash
cd alwan-web
npm run dev    # Start dev server
npm run build  # Build for production
npm run lint   # Run ESLint
```

---

### 2. **alwan-mobile** – Mobile Application

The core user experience for everyday financial transactions and loan applications.

**Technology Stack:**
- **Framework**: React Native 0.81 + Expo 54
- **Language**: TypeScript 5.9
- **Navigation**: Expo Router 6.0
- **Styling**: NativeWind 4.2 (Tailwind for React Native)
- **UI Components**: Custom components with Expo Symbols
- **Animations**: React Native Reanimated 4.1
- **Gestures**: React Native Gesture Handler 2.28
- **Auth/Database**: Supabase 2.95
- **File Handling**: Expo Document Picker + File System
- **Icons**: Expo Vector Icons 15.0

**Key Features:**
- Tab-based navigation
- Document upload for loan applications
- Real-time data synchronization
- Native haptic feedback
- Optimized images with Expo Image
- Cross-platform support (iOS, Android, Web)

**Development:**
```bash
cd alwan-mobile
npm start           # Start Expo dev server
npm run android     # Run on Android
npm run ios         # Run on iOS
npm run web         # Run in web browser
npm run lint        # Run ESLint
```

---

### 3. **alwan-admin** – Admin Dashboard

Internal dashboard for managing members, loans, collections, and system operations.

**Technology Stack:**
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS 3.4
- **Animations**: Framer Motion 12.34
- **UI Components**: Radix UI primitives
- **Forms**: React Hook Form + Zod validation
- **State Management**: Zustand 5.0
- **Data Fetching**: TanStack Query 5.90
- **Auth/Database**: Supabase (SSR + Client)
- **Charts**: Recharts 3.7
- **Date Handling**: date-fns 4.1

**Key Features:**
- Member management and registration
- Loan approval and tracking
- Collection monitoring (daily/weekly)
- Center management
- Staff and user administration
- Audit logs and activity tracking
- Reports and analytics
- Settings and configuration

**Development:**
```bash
cd alwan-admin
npm run dev    # Start dev server (port 3001)
npm run build  # Build for production
npm run lint   # Run ESLint
```

---

## 🔧 Shared Technologies

### Database & Authentication
- **Supabase**: PostgreSQL database with real-time subscriptions
- **Row Level Security (RLS)**: Secure data access patterns
- **SSR Support**: Server-side rendering with Supabase SSR package

### Design System
- **Theme**: Signature "Alwan" brand colors
  - Primary: Emerald/Dark Green
  - Accent: High Contrast White
  - Mode: Dark-first design
- **Typography**: Modern, accessible font stack
- **Components**: Consistent UI patterns across web and admin

### Development Tools
- **Concurrently**: Run multiple dev servers simultaneously
- **ESLint**: Code quality and consistency
- **TypeScript**: Type safety across all projects
- **EditorConfig**: Consistent coding styles

---

## 📦 Key Dependencies

### Web & Admin Shared Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 15.2.0 | React framework with App Router |
| `react` | 19.0.0 | UI library |
| `typescript` | 5.9.0 | Type safety |
| `tailwindcss` | 3.4.17 | Utility-first CSS |
| `@supabase/supabase-js` | 2.48.0 | Database client |
| `@supabase/ssr` | 0.7.0 | Server-side rendering support |
| `framer-motion` | 12.34.0 | Animation library |
| `react-hook-form` | 7.71.1 | Form management |
| `zod` | 4.3.6 | Schema validation |
| `zustand` | 5.0.11 | State management |
| `@tanstack/react-query` | 5.90.21 | Data fetching & caching |
| `lucide-react` | 0.564.0 | Icon library |
| `recharts` | 3.7.0 | Chart components |
| `sonner` | 2.0.7 | Toast notifications |

### Mobile-Specific Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `expo` | 54.0.33 | React Native framework |
| `react-native` | 0.81.5 | Mobile UI framework |
| `expo-router` | 6.0.23 | File-based routing |
| `nativewind` | 4.2.1 | Tailwind for React Native |
| `@supabase/supabase-js` | 2.95.3 | Database client |
| `react-native-reanimated` | 4.1.1 | Smooth animations |
| `expo-document-picker` | 14.0.8 | File selection |
| `expo-image` | 3.0.11 | Optimized images |

---

## 🌐 Environment Setup

Each project requires environment variables for Supabase and other services.

### Web & Admin (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Mobile (.env)
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🎨 Features

- **Modern Aesthetic**: Dark-mode themes with grainy gradients, bento-grid layouts, and glassmorphism
- **AI-Powered**: Instant credit scoring and loan approval logic
- **Responsive Design**: Mobile-first approach across all platforms
- **Real-time Updates**: Live data synchronization via Supabase
- **Type-Safe**: Full TypeScript coverage for reliability
- **Accessible**: WCAG-compliant UI components
- **Performance**: Optimized builds with Next.js and Expo
- **Scalable**: Monorepo structure for easy maintenance

---

## 📱 Platform Support

| Platform | Web Portal | Mobile App | Admin Dashboard |
|----------|------------|------------|-----------------|
| Desktop Web | ✅ | ❌ | ✅ |
| Mobile Web | ✅ | ✅ | ⚠️ Limited |
| iOS | ❌ | ✅ | ❌ |
| Android | ❌ | ✅ | ❌ |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

ISC License

---

## 👥 Team

- **Repository**: [github.com/ardfaiyaz/alwan](https://github.com/ardfaiyaz/alwan)
- **Keywords**: microfinance, kmbi, alwan, fintech, philippines

---

## 🆘 Support

For issues and questions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Contact the development team

---

**Built with ❤️ for Filipino communities**

