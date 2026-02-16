import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";

import "./globals.css";

const space = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space"
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  title: "User Console",
  description: "Next.js frontend for the User Management API"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${space.variable} ${plexMono.variable}`}>{children}</body>
    </html>
  );
}
