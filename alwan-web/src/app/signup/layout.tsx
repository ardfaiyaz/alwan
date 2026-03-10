import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up | Alwan',
  description: 'Create your Alwan account and start your microfinance journey',
}

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
