# Alwan – Microfinance for Every Filipino

Alwan is a modern microfinance ecosystem designed to empower Filipinos with accessible, AI-powered financial services. This repository contains the complete codebase for the Alwan platform, including its web portal, mobile application, and backend infrastructure.

---

## Project Structure

| Directory | Component | Technology | Description |
| --------- | --------- | ---------- | ----------- |
| `alwan-web` | **Web Portal** | Next.js 15, Tailwind CSS | The official landing page and web application for account management and loan tracking. |
| `alwan-mobile` | **Mobile App** | React Native, Expo | The core user experience for everyday financial transactions and instant applications. |
| `alwan-api` | **API Server** | Node.js / Bun | The backend engine handling business logic, AI approvals, and database interactions. |

---

## Tech Stack Overview

### Web (`alwan-web`)
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Auth/DB**: Supabase

### Mobile (`alwan-mobile`)
- **Framework**: React Native with Expo
- **Icons**: Lucide React Native
- **Styling**: NativeWind (Tailwind for React Native)

### Shared Services
- **Database**: PostgreSQL (via Supabase)
- **Design System**: Signature "Alwan" theme (Emerald / Dark Green / High Contrast White)

---

## Getting Started

To run individual projects, navigate to their respective directories and follow the README instructions within.

### Web Development
```bash
cd alwan-web
npm install
npm run dev
```

### Mobile Development
```bash
cd alwan-mobile
npm install
npx expo start
```

---

## Features

- **Modern Aesthetic**: Signature dark-mode themes with grainy gradients, bento-grid layouts, and glassmorphism.
- **AI-Powered**: Instant credit scoring and loan approval logic (Integrated in API).
- **Responsive Web**: A high-performance web landing page with interactive "How It Works" and "See Alwan in Action" sections.
- **Seamless Auth**: Cross-platform authentication powered by Supabase.

---

## License

MIT

