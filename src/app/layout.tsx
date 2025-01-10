import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth/authConfig";

const inter = Inter({ subsets: ["latin"] });

const displayFont = Syne({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-display",
});

const baseFont = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-default",
});

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.ico",
  },
  title:
    "AI Song Generator|Create Professional Music in Seconds|Free Online Tool",
  description:
    "Transform your ideas into studio-quality songs with our AI Song Generator. Create custom lyrics, melodies, and professional arrangements instantly. Try our free online music creation tool - No musical expertise required!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body
        className={`${baseFont.variable} ${displayFont.variable} font-sans antialiased`}
      >
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
