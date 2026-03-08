import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Audit Logs | Alwan Admin',
  description: 'View comprehensive audit logs of all system activities, staff actions, and CRUD operations.',
  keywords: ['audit logs', 'system logs', 'activity tracking', 'admin logs', 'KMBI'],
}

export default function LogsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
