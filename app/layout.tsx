import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KASUZAZ TECHNOLOGY | Secure Digital Solutions",
  description:
    "Malaysia-based technology studio for web development, custom systems, digital design, cybersecurity, cloud, AI and IT support.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: { url: "/kasuzaz-logo.png", type: "image/png", sizes: "400x400" },
    shortcut: "/kasuzaz-logo.png",
    apple: "/kasuzaz-logo.png",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
