import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services | Alwan',
  description: 'Explore our microfinance services including loans, savings, and insurance',
}

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
