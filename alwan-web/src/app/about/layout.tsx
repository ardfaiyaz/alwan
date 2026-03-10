import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | Alwan',
  description: 'Learn about Alwan and our mission to empower Filipinos through accessible microfinance',
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
