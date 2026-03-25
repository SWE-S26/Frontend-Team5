import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ThemeProvider from "@/components/theme/ThemeProvider"
import MockProvider from "@/components/MSWProvider"
import AuthGoogle from "@/components/auth/AuthGoogle"
import ReduxProvider from "@/components/ReduxProvider"
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My BeatZa App",
  description: "Craving Tunes",
  icons: {
    icon: "/app-logo/beatza.png",
  },
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
        <ReduxProvider>
          <MockProvider>
            <ThemeProvider>
              <AuthGoogle />
              {children}
            </ThemeProvider>
          </MockProvider>
        </ReduxProvider>
        <div className="h-12"/>
      </body>
    </html>
  );
}