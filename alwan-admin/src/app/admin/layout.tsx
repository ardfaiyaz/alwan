import { Sidebar } from '@/components/admin/Sidebar'
import { requireAuth } from '@/lib/auth/server-auth'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Require authentication for all admin pages
    const user = await requireAuth().catch(() => {
        redirect('/login')
    })

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />
            <div className="lg:pl-64">
                <main className="py-8 px-4 sm:px-6 lg:px-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
