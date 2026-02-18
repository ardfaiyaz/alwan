'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Users,
    FileText,
    DollarSign,
    BarChart3,
    UserCog,
    Shield,
    ScrollText,
    LogOut,
    Menu,
    X,
    Building2,
    CheckSquare
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/useAuthStore'
import { formatUserRole } from '@/lib/utils/formatters'
import { createClient } from '@/lib/supabase/client'
import { canAccessPage, type UserRole } from '@/lib/rbac/permissions'

// Define navigation items with role-based access
const navigationItems = [
    { 
        name: 'Dashboard', 
        href: '/admin/dashboard', 
        icon: LayoutDashboard,
        roles: ['admin', 'area_manager', 'branch_manager', 'field_officer'] as UserRole[]
    },
    { 
        name: 'Centers', 
        href: '/admin/centers', 
        icon: Building2,
        roles: ['admin', 'area_manager', 'branch_manager', 'field_officer'] as UserRole[]
    },
    { 
        name: 'Members', 
        href: '/admin/members', 
        icon: UserCog,
        roles: ['admin', 'area_manager', 'branch_manager', 'field_officer'] as UserRole[]
    },
    { 
        name: 'Loans', 
        href: '/admin/loans', 
        icon: FileText,
        roles: ['admin', 'area_manager', 'branch_manager', 'field_officer'] as UserRole[]
    },
    { 
        name: 'Collections', 
        href: '/admin/collections', 
        icon: DollarSign,
        roles: ['admin', 'area_manager', 'branch_manager', 'field_officer'] as UserRole[]
    },
    { 
        name: 'Reports', 
        href: '/admin/reports', 
        icon: BarChart3,
        roles: ['admin', 'area_manager', 'branch_manager', 'field_officer'] as UserRole[]
    },
    { 
        name: 'Approvals', 
        href: '/admin/approvals', 
        icon: CheckSquare,
        roles: ['admin', 'area_manager', 'branch_manager'] as UserRole[]
    },
    { 
        name: 'Staffs', 
        href: '/admin/staffs', 
        icon: Shield,
        roles: ['admin'] as UserRole[]
    },
    { 
        name: 'Audit Logs', 
        href: '/admin/logs', 
        icon: ScrollText,
        roles: ['admin'] as UserRole[]
    },
]

export function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [userRole, setUserRole] = useState<UserRole | null>(null)
    const { user, clearUser } = useAuthStore()

    // Get user role from database
    useEffect(() => {
        async function fetchUserRole() {
            if (!user) return
            
            const supabase = createClient()
            if (!supabase) return

            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            if (profile) {
                setUserRole(profile.role as UserRole)
            }
        }

        fetchUserRole()
    }, [user])

    // Filter navigation items based on user role
    const visibleNavigation = navigationItems.filter(item => {
        if (!userRole) return false
        return item.roles.includes(userRole)
    })

    const handleSignOut = async () => {
        const supabase = createClient()
        if (supabase) {
            await supabase.auth.signOut()
            clearUser()
            router.push('/')
        }
    }

    // Close sidebar when clicking outside on mobile
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsOpen(false)
            }
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-lg hover:shadow-xl transition-shadow"
                aria-label="Toggle menu"
            >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
                    isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-center h-16 px-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
                        <Image
                            src="/icons/alwan-footer-logo.png"
                            alt="Alwan KMBI"
                            width={120}
                            height={40}
                            className="object-contain"
                            priority
                        />
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {visibleNavigation.length > 0 ? (
                            visibleNavigation.map((item) => {
                                const isActive = pathname.startsWith(item.href)
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                                            isActive
                                                ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md"
                                                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                        )}
                                    >
                                        <item.icon className={cn(
                                            "h-5 w-5 flex-shrink-0",
                                            isActive ? "text-white" : "text-gray-500"
                                        )} />
                                        <span className="truncate">{item.name}</span>
                                    </Link>
                                )
                            })
                        ) : (
                            <div className="text-center py-8 text-gray-500 text-sm">
                                Loading menu...
                            </div>
                        )}
                    </nav>

                    {/* User profile */}
                    {user && (
                        <div className="p-4 border-t border-gray-200 bg-gray-50">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center text-white font-semibold shadow-md">
                                    {user.fullName.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {user.fullName}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {userRole ? formatUserRole(userRole) : formatUserRole(user.role)}
                                    </p>
                                </div>
                            </div>
                            <button
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-white hover:text-red-600 rounded-lg transition-all duration-200 border border-transparent hover:border-red-200"
                                onClick={handleSignOut}
                            >
                                <LogOut className="h-4 w-4" />
                                Sign out
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300"
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
            )}
        </>
    )
}
