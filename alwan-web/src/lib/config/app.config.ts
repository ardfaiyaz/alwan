/**
 * Application Configuration
 * @module lib/config
 */

export const appConfig = {
  name: 'Alwan',
  description: 'Microfinance for Every Filipino',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  
  // Feature flags
  features: {
    enableRegistration: true,
    enableMicroinsurance: true,
    enableSavings: true,
    enableLoans: true,
  },

  // Pagination
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },

  // API
  api: {
    timeout: 30000, // 30 seconds
    retries: 3,
  },

  // Sentry
  sentry: {
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  },

  // Supabase
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },
} as const

export type AppConfig = typeof appConfig
