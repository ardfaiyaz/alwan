import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Services | Alwan',
    description: 'Explore Alwan financial solutions: Micro Loans, Savings, Bill Payments, and Insurance designed for growth.',
}

export default function ServicesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
