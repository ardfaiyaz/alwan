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
