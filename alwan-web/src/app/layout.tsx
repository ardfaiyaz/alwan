import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";

/** Inter with multiple weights; font-medium applied globally for Inter Medium feel */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Alwan | Microfinance for Every Filipino",
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
      <body className="font-sans font-medium antialiased">
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  )
}