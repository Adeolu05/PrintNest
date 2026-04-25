import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { env } from "@/lib/env";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(env.appUrl),
  title: {
    default: "PrintNest — Turn your artwork into a print store in minutes",
    template: "%s · PrintNest",
  },
  description:
    "PrintNest is the fastest way for visual artists to turn artwork into sellable print pages. Upload art, let AI write the copy, share your store anywhere.",
  openGraph: {
    title: "PrintNest",
    description:
      "Upload your artwork. Let AI write the sales copy. Launch your print store in minutes.",
    siteName: "PrintNest",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <AnalyticsProvider>{children}</AnalyticsProvider>
      </body>
    </html>
  );
}
