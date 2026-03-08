import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Staff Management | Alwan Admin',
  description: 'Manage KMBI staff members, roles, and permissions. Add, edit, and monitor staff activities.',
  keywords: ['staff management', 'KMBI staff', 'admin', 'roles', 'permissions'],
}

export default function StaffsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
