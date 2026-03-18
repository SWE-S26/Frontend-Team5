import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ThemeProvider from "@/components/theme/ThemeProvider"
import MockProvider from "@/components/MSWProvider"
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My BeatZa App",
  description: "Craving Tunes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={inter.variable}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <MockProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </MockProvider>
        <div className="h-12"/>
      </body>
    </html>
  );
}