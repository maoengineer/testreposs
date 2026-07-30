import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CookieBanner from "@/components/layout/CookieBanner";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import ClientStateCheck from "@/components/ClientStateCheck";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://iusetools.site"),
  title: {
    default: "iUseTools - Free Online File Converter | PDF, Image & Text Tools",
    template: "%s | iUseTools",
  },
  description:
    "Convert files instantly for free. JPG to Word, PDF to Text, PDF to Word, Text to PDF, Image to PDF, and more. No signup. No upload. 100% private browser-based conversion.",
  keywords: [
    "free file converter",
    "PDF to Word",
    "JPG to Word",
    "PDF to text",
    "image to PDF",
    "text to PDF",
    "OCR online",
    "document converter",
    "online converter",
    "convert PDF free",
  ],
  authors: [{ name: "iUseTools" }],
  creator: "iUseTools",
  publisher: "iUseTools",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://iusetools.site",
    siteName: "iUseTools",
    title: "iUseTools - Free Online File Converter",
    description:
      "Convert files instantly for free. PDF, image, and text conversion tools. No signup. No upload. 100% private.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "iUseTools - Free Online File Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "iUseTools - Free Online File Converter",
    description: "Convert files instantly for free. No signup. No upload. 100% private browser-based conversion.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Google Search Console verification
  verification: {
    google: "5W5Ysnw1cYgWeBk7CFksL7n3mccT7aFuJdLmve-10_4",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${outfit.variable}`}>
      <head>
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9646271146999593"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased">
        {/* Google Analytics GA4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4TKNHVBV93"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4TKNHVBV93');
          `}
        </Script>

        <ThemeProvider>
          <ClientStateCheck />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
