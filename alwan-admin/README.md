# Alwan Admin Dashboard

The internal administrative dashboard for Alwan Microfinance, providing staff with tools to manage members, loans, collections, and system operations.

---

## 📋 Overview

This is the admin dashboard built with Next.js 15, featuring comprehensive management tools for microfinance operations. It serves as the control center for Alwan staff to handle day-to-day operations and oversight.

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
# Start development server (default port 3001)
npm run dev

# Start on specific port
npm run dev -- -p 3001

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
alwan-admin/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── actions/           # Server actions
│   │   │   ├── approvals.ts
│   │   │   ├── audit.ts
│   │   │   ├── auth-logging.ts
│   │   │   ├── centers.ts
│   │   │   ├── collections.ts
│   │   │   ├── members.ts
│   │   │   └── staff.ts
│   │   ├── admin/             # Admin pages
│   │   │   ├── centers/      # Center management
│   │   │   ├── collections/  # Collection tracking
│   │   │   ├── dashboard/    # Main dashboard
│   │   │   ├── loans/        # Loan management
│   │   │   ├── logs/         # Audit logs
│   │   │   ├── members/      # Member management
│   │   │   ├── reports/      # Reports & analytics
│   │   │   ├── settings/     # System settings
│   │   │   ├── staffs/       # Staff management
│   │   │   └── users/        # User administration
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Landing page
│   │   └── globals.css       # Global styles
│   ├── components/           # React components
│   │   ├── admin/           # Admin-specific components
│   │   │   ├── charts/      # Chart components
│   │   │   └── Sidebar.tsx  # Navigation sidebar
│   │   ├── auth/            # Authentication components
│   │   ├── skeletons/       # Loading skeletons
│   │   ├── ui/              # Reusable UI components
│   │   └── providers.tsx    # Context providers
│   └── lib/                  # Utilities and configurations
│       ├── supabase/        # Supabase client setup
│       ├── utils.ts         # Helper functions
│       └── ...
├── public/                   # Static assets
│   ├── icons/               # Logo and icon files
│   └── images/              # Image assets
├── .env.local               # Environment variables (not in git)
├── next.config.ts           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
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

### Member Management
- **Registration**: Add new members with complete information
- **Profile Management**: View and edit member details
- **Member Search**: Quick search and filtering
- **Member History**: View transaction and loan history

### Loan Management
- **Loan Applications**: Process new loan requests
- **Approval Workflow**: Review and approve/reject loans
- **Loan Tracking**: Monitor active loans and repayments
- **Loan History**: Complete loan lifecycle tracking

### Collection Management
- **Daily Collections**: Track daily collection activities
- **Weekly Collections**: Monitor weekly collection schedules
- **Collection Reports**: Generate collection summaries
- **Payment Recording**: Record and verify payments

### Center Management
- **Center Registration**: Add and manage centers
- **Center Details**: View center information and members
- **Center Transfer**: Transfer members between centers
- **Center Reports**: Generate center-specific reports

### Staff Management
- **Staff Registration**: Add new staff members
- **Role Assignment**: Assign roles and permissions
- **Staff Activity**: Monitor staff activities
- **Performance Tracking**: Track staff performance metrics

### Reports & Analytics
- **Dashboard**: Overview of key metrics
- **Collection Efficiency**: Track collection performance
- **PAR (Portfolio at Risk)**: Monitor loan portfolio health
- **Custom Reports**: Generate various reports
- **Data Visualization**: Charts and graphs with Recharts

### Audit & Logging
- **Activity Logs**: Track all system activities
- **Authentication Logs**: Monitor login attempts
- **Audit Trail**: Complete audit history
- **User Actions**: Track user-specific actions

### Settings
- **System Configuration**: Manage system settings
- **User Management**: Administer user accounts
- **Center Transfer**: Configure center transfers
- **Permissions**: Manage role-based access control

---

## 📦 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server (port 3001) |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 🔗 Integration

### Supabase
The admin dashboard integrates with Supabase for:
- Staff authentication and authorization
- Database queries (members, loans, collections, etc.)
- Real-time subscriptions for live updates
- Row Level Security (RLS) for data protection
- Server-side rendering support

### Server Actions
Next.js server actions handle:
- Member operations (CRUD)
- Loan processing and approvals
- Collection recording
- Center management
- Staff administration
- Audit logging

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
- Implement proper error handling
- Add loading states for async operations

### Security Best Practices
- Always validate user permissions
- Use server actions for sensitive operations
- Implement proper authentication checks
- Sanitize user inputs
- Use Supabase RLS policies
- Log all critical actions

### Component Structure
```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface AdminComponentProps {
  title: string
  // ... other props
}

export function AdminComponent({ title }: AdminComponentProps) {
  const [loading, setLoading] = useState(false)

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      {/* Component content */}
    </div>
  )
}
```

### Naming Conventions
- Components: PascalCase (e.g., `MemberList.tsx`)
- Server Actions: camelCase (e.g., `createMember.ts`)
- Utilities: camelCase (e.g., `formatCurrency.ts`)
- Constants: UPPER_SNAKE_CASE (e.g., `MAX_LOAN_AMOUNT`)

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

**Authentication issues:**
- Verify Supabase credentials in `.env.local`
- Check Supabase RLS policies
- Ensure user has proper permissions

**Database connection errors:**
- Verify Supabase URL and anon key
- Check network connectivity
- Review Supabase project status

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs/primitives)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Recharts Documentation](https://recharts.org/)

---

## 🔐 Access Control

The admin dashboard implements role-based access control (RBAC):

- **Super Admin**: Full system access
- **Admin**: Most administrative functions
- **Manager**: Center and member management
- **Staff**: Basic operations and data entry
- **Viewer**: Read-only access

Permissions are enforced at:
- UI level (component visibility)
- API level (server actions)
- Database level (Supabase RLS)

---

## 🤝 Contributing

This is part of the Alwan monorepo. See the [root README](../README.md) for contribution guidelines.

---

**Part of the Alwan Microfinance Platform** | [Back to Root](../README.md)
