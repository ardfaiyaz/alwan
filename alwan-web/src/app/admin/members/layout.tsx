import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Members Management | Alwan Admin',
  description: 'Manage trust banking members, view member details, CBU balances, and member activities.',
  keywords: ['members', 'trust banking', 'CBU', 'microfinance', 'KMBI members'],
}

export default function MembersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
