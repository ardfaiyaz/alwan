import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Register | Alwan',
    description: 'Get started with Alwan. Download the app to create your account and access financial services.',
}

export default function RegisterLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
