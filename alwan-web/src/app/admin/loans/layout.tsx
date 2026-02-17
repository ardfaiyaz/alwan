import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Loans Management | Alwan Admin',
  description: 'Manage microfinance loans, approvals, disbursements, and repayments for KMBI members.',
  keywords: ['loans', 'microfinance', 'loan approval', 'disbursement', 'KMBI'],
}

export default function LoansLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
