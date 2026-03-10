import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms and Conditions | Alwan',
  description: 'Read the terms and conditions for using Alwan microfinance services',
}

export default function TermsAndConditionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
