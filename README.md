# Alwan – Microfinance for Every Filipino

A modern microfinance app website built with **Next.js**, **Tailwind CSS**, and **Supabase**. Philippine-based and designed to empower Filipinos with accessible financial services.

---

## Tech Stack

| Layer        | Technology        |
| ------------ | ----------------- |
| Framework    | Next.js 15        |
| Styling      | Tailwind CSS v4   |
| Auth         | Supabase          |
| Animations   | Framer Motion     |
| Font         | Inter (Google)    |

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy the example env file and add your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these from [Supabase Dashboard](https://supabase.com/dashboard) → your project → **Settings** → **API**.

### 3. Enable Email auth in Supabase

1. In Supabase: **Authentication** → **Providers**
2. Enable **Email**
3. (Optional) Customize **Authentication** → **Email Templates**

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Build & production

```bash
npm run build
npm start
```

---

## Deploy on Vercel

1. **Push this repo to GitHub** (if not already).

2. **Import in Vercel**
   - Go to [vercel.com](https://vercel.com) → **Add New** → **Project**
   - Import your GitHub repo and use the default settings (Next.js is auto-detected).

3. **Add environment variables** in Vercel:
   - Project → **Settings** → **Environment Variables**
   - Add:
     - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase project URL  
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon/public key  
   - Apply to **Production**, **Preview**, and **Development** if you use preview branches.

4. **Deploy**
   - Deploy from the **Deployments** tab or push to the connected branch; Vercel will build and deploy.

**Notes for Vercel:**

- Do **not** commit `.env.local`; use Vercel’s env UI only.
- If you don’t set the Supabase env vars, the app still builds; auth (login/register) will fail until vars are added.
- Root middleware runs on every request (except static files) to refresh Supabase sessions.

---

## Project structure (main paths)

| Path                    | Purpose                          |
| ----------------------- | -------------------------------- |
| `src/app/`              | App Router pages and layout      |
| `src/app/page.tsx`     | Homepage                         |
| `src/app/login/`       | Login (split layout)             |
| `src/app/register/`    | Registration                     |
| `src/app/services/`    | Services + loan calculator       |
| `src/app/about/`       | About + team                     |
| `src/app/faq/`         | FAQ (bento cards)                |
| `src/components/`      | Header, Footer, shared UI         |
| `src/lib/supabase/`    | Supabase client, server, middleware |
| `src/lib/validations/` | Zod schemas (auth)               |

---

## Pages overview

| Route       | Description                                                                 |
| ----------- | --------------------------------------------------------------------------- |
| `/`         | Home: hero (Get started → register, Learn more → Why choose), why choose us, video, how it works, affiliated companies, mobile download CTA |
| `/services` | Services hero, loan calculator, 4 service cards (loans, savings, bills, insurance) |
| `/about`    | Mission, core values, team (3 developers)                                  |
| `/faq`      | Bento-style FAQ with expandable answers                                    |
| `/login`    | Split-screen login (brand panel + form card)                                |
| `/register` | Download-focused: steps to get the app and sign up in-app; link to login    |

---

## Features

- Reusable **Header** and **Footer** (nav, auth buttons)
- **Supabase** authentication (login, register, session refresh via middleware)
- Responsive layout and **Framer Motion** animations
- **Inter** font (medium weight default)
- Philippine context (bayanihan, peso, local mobile format)
- Violet/teal theme; ready for production build and Vercel deploy

---

## License

MIT
