# Alwan Web Portal

The customer-facing website for Alwan Microfinance, showcasing services, features, and providing information to potential members.

---

## 📋 Overview

This is the public web portal built with Next.js 15, featuring a modern dark-mode design with the signature Alwan brand aesthetic. It serves as the primary marketing and information hub for the Alwan microfinance platform.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Git** for version control

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

### Development

```bash
# Start development server (default port 3000)
npm run dev

# Start on specific port
npm run dev -- -p 3000

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## 🏗️ Project Structure

```
alwan-web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── about/             # About page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── ...
│   │   └── providers.tsx     # Context providers
│   └── lib/                   # Utilities and configurations
│       ├── supabase/         # Supabase client setup
│       ├── utils.ts          # Helper functions
│       └── ...
├── public/                    # Static assets
│   ├── icons/                # Logo and icon files
│   └── images/               # Image assets
├── .env.local                # Environment variables (not in git)
├── next.config.ts            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```

---

## 🛠️ Technology Stack

### Core Framework
- **Next.js** 15.2.0 - React framework with App Router
- **React** 19.0.0 - UI library
- **TypeScript** 5.9.0 - Type safety

### Styling & UI
- **Tailwind CSS** 3.4.17 - Utility-first CSS framework
- **Framer Motion** 12.34.0 - Animation library
- **Radix UI** - Accessible component primitives
  - `@radix-ui/react-dialog` 1.1.15
  - `@radix-ui/react-dropdown-menu` 2.1.16
  - `@radix-ui/react-label` 2.1.8
  - `@radix-ui/react-select` 2.2.6
  - `@radix-ui/react-slot` 1.2.4
  - `@radix-ui/react-tabs` 1.1.13
- **Lucide React** 0.564.0 - Icon library
- **class-variance-authority** 0.7.1 - Component variants
- **clsx** 2.1.1 - Conditional classNames
- **tailwind-merge** 3.4.1 - Merge Tailwind classes

### Forms & Validation
- **React Hook Form** 7.71.1 - Form management
- **Zod** 4.3.6 - Schema validation
- **@hookform/resolvers** 5.2.2 - Form validation resolvers

### Data & State Management
- **TanStack Query** 5.90.21 - Data fetching and caching
- **Zustand** 5.0.11 - State management
- **Supabase** 2.48.0 - Database and authentication
  - `@supabase/supabase-js` - Client library
  - `@supabase/ssr` 0.7.0 - Server-side rendering support

### Utilities
- **date-fns** 4.1.0 - Date manipulation
- **Recharts** 3.7.0 - Chart components
- **Sonner** 2.0.7 - Toast notifications

### Development Tools
- **ESLint** 9.18.0 - Code linting
- **PostCSS** 8.4.49 - CSS processing
- **Autoprefixer** 10.4.20 - CSS vendor prefixes

---

## 🌐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🎨 Key Features

### Design
- **Dark Mode First**: Signature Alwan dark theme with emerald accents
- **Glassmorphism**: Modern glass-effect UI elements

### Member Features
- **Signup with Document Upload**: 4-step signup process with proof of billing upload
- **Phone Verification**: OTP-based phone number verification
- **PIN Security**: 5-digit PIN for account security

### Admin Features
- **Document Approvals**: Review and approve member documents with zoom functionality
- **Audit Trail**: Complete logging of all approval/rejection actions
- **Role-Based Access**: Granular permissions for admin, area managers, and branch managers

For detailed documentation on the document approvals system, see:
- `QUICK_START_APPROVALS.md` - Quick setup guide
- `DOCUMENT_APPROVALS_IMPLEMENTATION.md` - Complete technical documentation
- **Gradient Backgrounds**: Grainy gradient effects
- **Responsive**: Mobile-first design approach
- **Animations**: Smooth transitions with Framer Motion

### Pages
- **Home**: Hero section, features showcase, call-to-action
- **About**: Team information, mission, and values
- **Responsive Navigation**: Mobile-friendly menu

### Components
- **Reusable UI**: Button, Card, Dialog, Input, Select, Tabs
- **Form Components**: Integrated with React Hook Form
- **Toast Notifications**: User feedback with Sonner
- **Charts**: Data visualization with Recharts

---

## 📦 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 🔗 Integration

### Supabase
The web portal integrates with Supabase for:
- User authentication
- Database queries
- Real-time subscriptions
- Server-side rendering support

### API Routes
Next.js API routes can be added in `src/app/api/` for server-side logic.

---

## 🚢 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Manual Deployment
```bash
# Build the project
npm run build

# The output will be in .next/ directory
# Deploy the .next/ directory to your hosting provider
```

---

## 🎯 Development Guidelines

### Code Style
- Use TypeScript for all new files
- Follow ESLint rules
- Use Tailwind CSS for styling
- Keep components small and focused
- Use server components by default, client components when needed

### Component Structure
```tsx
// Use 'use client' only when necessary
'use client'

import { ComponentProps } from 'react'

interface MyComponentProps {
  title: string
  // ... other props
}

export function MyComponent({ title }: MyComponentProps) {
  return (
    <div className="...">
      {/* Component content */}
    </div>
  )
}
```

### Naming Conventions
- Components: PascalCase (e.g., `Button.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_URL`)

---

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Use a different port
npm run dev -- -p 3002
```

**Environment variables not loading:**
- Ensure `.env.local` exists
- Restart the dev server after changing env vars
- Check that variables start with `NEXT_PUBLIC_` for client-side access

**Build errors:**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs/primitives)
- [Framer Motion Documentation](https://www.framer.com/motion/)

---

## 🤝 Contributing

This is part of the Alwan monorepo. See the [root README](../README.md) for contribution guidelines.

---

**Part of the Alwan Microfinance Platform** | [Back to Root](../README.md)
