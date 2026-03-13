import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { canAccessPage, type UserRole } from '@/lib/rbac/permissions'
import { validateTimeBasedAccess } from '@/lib/rbac/security-layers'

// Security: Track failed login attempts
const failedAttempts = new Map<string, { count: number; lastAttempt: number }>()
const MAX_FAILED_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Public routes that anyone can access
  const publicRoutes = ['/', '/about', '/services', '/contact', '/login', '/signup', '/faq']
  const isPublicRoute = publicRoutes.includes(pathname) || 
                        pathname.startsWith('/api/') || 
                        pathname.startsWith('/legal/')
  
  // Client-only routes (not for admins)
  const clientOnlyRoutes = ['/services', '/contact', '/faq']
  
  // Check if user is admin and trying to access client-only pages
  if (user && clientOnlyRoutes.some(route => pathname.startsWith(route))) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile && ['admin', 'area_manager', 'branch_manager', 'field_officer'].includes(profile.role)) {
      // Redirect admin users to dashboard
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/admin/dashboard'
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Redirect authenticated admins from homepage to dashboard
  if (user && pathname === '/') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile && ['admin', 'area_manager', 'branch_manager', 'field_officer'].includes(profile.role)) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/admin/dashboard'
      return NextResponse.redirect(redirectUrl)
    }
  }

  if (isPublicRoute) {
    return response
  }

  // Require authentication for /admin routes
  if (pathname.startsWith('/admin')) {
    // Security Layer: Get client IP for tracking
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'

    if (!user) {
      // Track failed access attempts
      const attempts = failedAttempts.get(clientIp) || { count: 0, lastAttempt: 0 }
      const now = Date.now()

      // Check if IP is locked out
      if (attempts.count >= MAX_FAILED_ATTEMPTS && 
          now - attempts.lastAttempt < LOCKOUT_DURATION) {
        const response = NextResponse.json(
          { error: 'Too many failed attempts. Please try again later.' },
          { status: 429 }
        )
        response.headers.set('Retry-After', String(Math.ceil((LOCKOUT_DURATION - (now - attempts.lastAttempt)) / 1000)))
        return response
      }

      // Update failed attempts
      failedAttempts.set(clientIp, { count: attempts.count + 1, lastAttempt: now })

      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/login'
      redirectUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Clear failed attempts on successful auth
    failedAttempts.delete(clientIp)

    // Get user profile to check role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_active, last_password_change, mfa_enabled')
      .eq('id', user.id)
      .single()

    if (!profile) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/login'
      return NextResponse.redirect(redirectUrl)
    }

    // Security Layer: Check if account is active
    if (profile.is_active === false) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/login'
      redirectUrl.searchParams.set('error', 'account_disabled')
      return NextResponse.redirect(redirectUrl)
    }

    const userRole = profile.role as UserRole

    // Security Layer: Time-based access control
    const timeCheck = validateTimeBasedAccess(userRole)
    if (!timeCheck.allowed) {
      return NextResponse.json(
        { error: timeCheck.reason || 'Access not allowed at this time' },
        { status: 403 }
      )
    }

    // Security Layer: Check page access permissions
    if (!canAccessPage(userRole, pathname)) {
      // Log unauthorized access attempt
      await supabase.from('security_audit_logs').insert({
        user_id: user.id,
        user_role: userRole,
        action: 'unauthorized_access_attempt',
        resource: 'page',
        resource_id: pathname,
        ip_address: clientIp,
        user_agent: request.headers.get('user-agent') || 'unknown',
        success: false,
        failure_reason: 'Insufficient permissions',
      })

      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/admin/dashboard'
      redirectUrl.searchParams.set('error', 'unauthorized')
      return NextResponse.redirect(redirectUrl)
    }

    // Security Layer: Add security headers
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=()'
    )
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
