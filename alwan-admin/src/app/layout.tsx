import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

/** Inter with multiple weights; font-medium applied globally for Inter Medium feel */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Admin Portal | Alwan KMBI",
  description:
    "Alwan KMBI Admin Portal - Manage microfinance operations, members, loans, and collections.",
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
        {children}
      </body>
    </html>
  )
}
