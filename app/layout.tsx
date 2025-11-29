import { Outfit, Geist_Mono, EB_Garamond } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const ebGaramond = EB_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "UOL Admission Assistant",
  description: "AI-powered chatbot for University of Lahore admissions",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${geistMono.variable} ${ebGaramond.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
