import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NenoText AI - Make AI Text Undetectable",
  description:
    "Transform AI-generated content into human-quality writing that bypasses AI detectors. Powered by advanced LLM engines.",
  keywords: [
    "AI humanizer",
    "AI detector bypass",
    "text rewriter",
    "content humanizer",
    "NenoText",
  ],
  authors: [{ name: "NenoText AI" }],
  openGraph: {
    title: "NenoText AI - Make AI Text Undetectable",
    description:
      "Transform AI-generated content into human-quality writing that bypasses AI detectors.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.variable}>
        <body className="min-h-screen bg-dark-950 text-dark-50 antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
