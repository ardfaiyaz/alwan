import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Toaster } from "sonner";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { Providers } from "@/components/providers";

/** Inter with multiple weights; font-medium applied globally for Inter Medium feel */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Home | Alwan",
  description:
    "Empowering Filipinos with accessible microfinance solutions. Loans, savings, and financial services designed for you.",
  icons: {
    icon: "/icons/alwan-logo-colored.png",
    shortcut: "/icons/alwan-logo-colored.png",
    apple: "/icons/alwan-logo-colored.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans font-medium antialiased overflow-x-hidden">
        <Providers>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
          <Toaster 
            position="top-center" 
            richColors 
            closeButton 
            expand={false}
            toastOptions={{
              duration: 3000,
              style: {
                background: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                fontSize: '14px',
                fontWeight: '500',
              },
              className: 'font-sans',
              success: {
                style: {
                  background: 'white',
                  border: '1px solid #10b981',
                  color: '#065f46',
                },
                iconTheme: {
                  primary: '#10b981',
                  secondary: 'white',
                },
              },
              error: {
                style: {
                  background: 'white',
                  border: '1px solid #ef4444',
                  color: '#991b1b',
                },
                iconTheme: {
                  primary: '#ef4444',
                  secondary: 'white',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}