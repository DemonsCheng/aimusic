import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "./providers";

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
    icon: "/icons/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
  },
  title: "AI Song Generator|Create Professional Music|Free Online",
  description:
    "Transform your ideas into studio-quality songs with our AI Song Generator.Create custom lyrics, melodies, and songs instantly.Try free AI song generator tool!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${baseFont.variable} ${displayFont.variable} font-sans antialiased`}
      >
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
