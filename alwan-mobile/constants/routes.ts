export const ROUTES = {
  // Onboarding
  SPLASH: '/(onboarding)/splash',
  
  // Auth
  LOGIN_PHONE: '/(auth)/login-phone',
  LOGIN_PIN: '/(auth)/login-pin',
  SIGNUP_INFO: '/(auth)/signup-info',
  SIGNUP_PHONE: '/(auth)/signup-phone',
  SIGNUP_OTP: '/(auth)/signup-otp',
  SIGNUP_PIN: '/(auth)/signup-pin',
  
  // Orientation
  ORIENTATION_1: '/(auth)/orientation-1',
  ORIENTATION_2: '/(auth)/orientation-2',
  ORIENTATION_3: '/(auth)/orientation-3',
  
  // Main App
  HOME: '/(tabs)',
  LOANS: '/loans',
  LOAN_APPLY_VERIFICATION: '/loans/apply-verification',
  LOAN_APPLY: '/loans/apply',
  LOAN_ACTIVE: '/loans/active-loans',
  
  PAYMENT: '/payment',
  PAYMENT_REPAYMENT: '/payment/repayment',
  
  SAVINGS: '/savings',
  SAVINGS_APPLY: '/savings/apply',
  
  ACCOUNT: '/(tabs)/account',
  
  // Profile
  PROFILE: '/profile',
  PROFILE_EDIT: '/profile/edit',
  PROFILE_SECURITY: '/profile/security',
  PROFILE_CHANGE_PIN: '/profile/change-pin',
  
  // Support
  SUPPORT: '/support/help',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = typeof ROUTES[RouteKey];
