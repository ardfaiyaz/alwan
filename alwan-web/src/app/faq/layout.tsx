import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ | Alwan',
  description: 'Frequently asked questions about Alwan microfinance services',
}

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
