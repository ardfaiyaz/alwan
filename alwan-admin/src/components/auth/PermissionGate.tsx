'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { hasPermission, type UserRole, type Resource, type Action } from '@/lib/rbac/permissions'
import { Shield, Loader2 } from 'lucide-react'

interface PermissionGateProps {
  children: React.ReactNode
  requiredRoles?: UserRole[]
  requiredPermission?: { resource: Resource; action: Action }
  fallbackPath?: string
}

export function PermissionGate({
  children,
  requiredRoles,
  requiredPermission,
  fallbackPath = '/admin/dashboard'
}: PermissionGateProps) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkPermissions()
  }, [])

  async function checkPermissions() {
    try {
      const supabase = createClient()
      if (!supabase) {
        router.push('/login')
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile) {
        router.push('/login')
        return
      }

      const userRole = profile.role as UserRole

      // Check role requirement
      if (requiredRoles && !requiredRoles.includes(userRole)) {
        setIsAuthorized(false)
        router.push(fallbackPath)
        return
      }

      // Check permission requirement
      if (requiredPermission) {
        const { resource, action } = requiredPermission
        if (!hasPermission(userRole, resource, action)) {
          setIsAuthorized(false)
          router.push(fallbackPath)
          return
        }
      }

      setIsAuthorized(true)
    } catch (error) {
      console.error('Permission check error:', error)
      router.push('/login')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Checking permissions...</p>
        </div>
      </div>
    )
  }

  if (isAuthorized === false) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <p className="text-sm text-gray-500">Redirecting...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Convenience wrapper for admin-only pages
export function AdminOnly({ children }: { children: React.ReactNode }) {
  return (
    <PermissionGate requiredRoles={['admin']}>
      {children}
    </PermissionGate>
  )
}

// Convenience wrapper for manager pages
export function ManagerOnly({ children }: { children: React.ReactNode }) {
  return (
    <PermissionGate requiredRoles={['admin', 'area_manager', 'branch_manager']}>
      {children}
    </PermissionGate>
  )
}
