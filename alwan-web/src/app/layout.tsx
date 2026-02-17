import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";

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
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
        <Toaster 
          position="top-right" 
          richColors 
          closeButton 
          expand={true}
          toastOptions={{
            duration: 4000,
            style: {
              background: 'white',
              border: '1px solid #e5e7eb',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
            className: 'font-sans',
          }}
        />
      </body>
    </html>
  )
}