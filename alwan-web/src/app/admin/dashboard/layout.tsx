import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard | Alwan Admin',
  description: 'KMBI administrative dashboard with key metrics, statistics, and system overview.',
  keywords: ['dashboard', 'admin', 'statistics', 'metrics', 'KMBI'],
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
