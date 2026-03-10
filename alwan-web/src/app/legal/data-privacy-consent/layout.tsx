import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Data Privacy Consent | Alwan',
  description: 'Data privacy consent in compliance with the Data Privacy Act of 2012',
}

export default function DataPrivacyConsentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
