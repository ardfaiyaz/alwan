import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'FAQs | Alwan',
    description: 'Find answers to common questions about Alwan loans, savings, security, and account management.',
}

export default function FAQLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
