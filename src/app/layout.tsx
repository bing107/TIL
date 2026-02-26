import type { Metadata } from "next";
import Header from "@/components/header";
import Footer from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "TIL — Hassan Syed",
  description:
    "Today I Learned — short posts about things I learn day to day.",
};

/*
 * Font strategy: system font stack via Tailwind's `font-sans` utility.
 * This avoids an external network request for Google Fonts (Inter) and uses
 * the native UI typeface on every platform, which keeps load times minimal.
 */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans flex flex-col min-h-screen antialiased">
        <Header />
        <main className="flex-1 max-w-2xl mx-auto px-4 py-8 w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
