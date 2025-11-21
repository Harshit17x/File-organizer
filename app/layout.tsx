import type { Metadata } from "next";
import "./globals.css";
import { SplashWrapper } from "@/components/layout/SplashWrapper";
import { StorageProvider } from "@/components/providers/StorageProvider";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { LedgerStyleBackground } from "@/components/ui/LedgerStyleBackground";
import Script from "next/script";

export const metadata: Metadata = {
  title: "File Organizer",
  description: "A modern, aesthetic file organizer application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-script" strategy="beforeInteractive">
          {`
            try {
              const theme = localStorage.getItem('file-organizer-theme') || 'dark';
              document.documentElement.classList.add(theme);
            } catch (e) {}
          `}
        </Script>
      </head>
      <body
        className="antialiased font-sans"
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          <AuthProvider>
            <StorageProvider>
              <LedgerStyleBackground />
              <SplashWrapper>
                {children}
              </SplashWrapper>
            </StorageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
