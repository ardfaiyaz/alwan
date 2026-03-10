import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Alwan',
  description: 'Learn how Alwan collects, uses, and protects your personal information',
}

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
