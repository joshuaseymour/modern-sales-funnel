import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { ThemeProvider } from "next-themes";
import { StripeProvider } from "@/components/providers/stripe-provider";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Build High-Converting Sales Funnels - $97 DIY System",
  description: "Get the exact 3-step funnel system that generated $2.3M+ in revenue. Choose DIY ($97), Done-With-You ($997), or Done-For-You ($9,997).",
  keywords: ["sales funnel", "conversion", "marketing", "business", "entrepreneur"],
  authors: [{ name: "Sales Funnel Systems" }],
  robots: "index, follow",
  openGraph: {
    title: "Build High-Converting Sales Funnels - Sales Funnel Systems",
    description: "Proven 3-step funnel system. $2.3M+ generated. Start with DIY for $97.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning
      className={inter.variable}
    >
      <body 
        className="min-h-screen bg-background font-sans antialiased"
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <StripeProvider>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </StripeProvider>
        </ThemeProvider>
        <Toaster 
          position="top-center"
          richColors
          closeButton
          duration={4000}
        />
      </body>
    </html>
  );
}
