/**
 * Application Routes
 * @module lib/constants
 */

export const ROUTES = {
  // Public routes
  HOME: '/',
  ABOUT: '/about',
  SERVICES: '/services',
  FAQ: '/faq',
  PRIVACY_POLICY: '/privacy-policy',
  TERMS_OF_SERVICE: '/terms-of-service',
  DATA_PROTECTION: '/data-protection',

  // Auth routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',

  // Admin routes
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin/dashboard',
    MEMBERS: '/admin/members',
    MEMBERS_NEW: '/admin/members/new',
    MEMBERS_DETAIL: (id: string) => `/admin/members/${id}`,
    LOANS: '/admin/loans',
    LOANS_NEW: '/admin/loans/new',
    COLLECTIONS: '/admin/collections',
    COLLECTIONS_WEEKLY: '/admin/collections/weekly',
    CENTERS: '/admin/centers',
    CENTERS_NEW: '/admin/centers/new',
    STAFFS: '/admin/staffs',
    LOGS: '/admin/logs',
    REPORTS: '/admin/reports',
    SETTINGS: '/admin/settings',
    SETTINGS_TRANSFER_CENTER: '/admin/settings/transfer-center',
  },

  // API routes
  API: {
    HEALTH: '/api/health',
  },
} as const

export type Routes = typeof ROUTES
