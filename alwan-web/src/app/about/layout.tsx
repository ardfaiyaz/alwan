import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'About Us | Alwan',
    description: 'Learn about Alwan, our mission to empower Filipino entrepreneurs, and the team behind the platform.',
}

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
