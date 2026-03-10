'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isAdminRoute = pathname?.startsWith('/admin')
    const isSignupRoute = pathname?.startsWith('/signup')

    return (
        <>
            {!isAdminRoute && !isSignupRoute && <Header />}
            {isAdminRoute || isSignupRoute ? (
                children
            ) : (
                <main className="min-h-screen">
                    {children}
                </main>
            )}
            {!isAdminRoute && !isSignupRoute && <Footer />}
        </>
    )
}
