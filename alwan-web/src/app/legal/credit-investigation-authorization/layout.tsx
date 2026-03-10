import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Credit Investigation Authorization | Alwan',
  description: 'Authorization for credit information and background verification',
}

export default function CreditInvestigationAuthorizationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
