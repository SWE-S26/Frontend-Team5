import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ThemeProvider from "@/components/settings/theme/ThemeProvider";
import MockProvider from "@/components/MSWProvider";
import AuthGoogle from "@/components/auth/AuthGoogle";
import ReduxProvider from "@/components/ReduxProvider";
import AntProviders from "@/components/AntProviders";
import "./globals.css";
import AudioBridge from "@/components/AudioBridge";

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
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased">
        <ReduxProvider>
          <AntProviders>
            <MockProvider>
              <ThemeProvider>
                <AuthGoogle />
                <AudioBridge />
                {children}
              </ThemeProvider>
            </MockProvider>
          </AntProviders>
        </ReduxProvider>
      </body>
    </html>
  );
}
