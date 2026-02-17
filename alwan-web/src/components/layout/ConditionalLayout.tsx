'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isAdminRoute = pathname?.startsWith('/admin')

    return (
        <>
            {!isAdminRoute && <Header />}
            {isAdminRoute ? (
                children
            ) : (
                <main className="min-h-screen">
                    {children}
                </main>
            )}
            {!isAdminRoute && <Footer />}
        </>
    )
}
