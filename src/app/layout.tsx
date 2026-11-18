import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { services } from "@/data/services";
import {
  hasAddress,
  hasEmail,
  hasPhone,
  mapsHref,
  siteConfig,
} from "@/data/site";

const inter = localFont({
  src: "./fonts/Inter-Variable.woff2",
  variable: "--font-inter",
  weight: "300 600",
  style: "normal",
  display: "swap",
  preload: true,
  fallback: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
});

const editorial = localFont({
  src: [
    {
      path: "./fonts/SourceSerif4-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/SourceSerif4-Italic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-editorial",
  display: "swap",
  preload: false,
  fallback: ["Iowan Old Style", "Georgia", "serif"],
});

const siteUrl = siteConfig.url;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.title,
    template: "%s — ARTCO",
  },
  description: siteConfig.description,
  applicationName: "ARTCO",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  category: "Visual production",
  keywords: [
    "ARTCO",
    "printing",
    "signage",
    "visual production",
    "vinyl printing",
    "flex printing",
    "laser cutting",
    "UV printing",
    "engraving",
    "custom artwork",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "ARTCO",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "none",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
  themeColor: "#0B1220",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "ARTCO",
  alternateName: "ARTCO Visual Production",
  url: siteUrl,
  logo: `${siteUrl}/icon.svg`,
  description: siteConfig.description,
  ...(hasPhone ? { telephone: siteConfig.phone } : {}),
  ...(hasEmail ? { email: siteConfig.email } : {}),
  ...(hasAddress
    ? {
        address: {
          "@type": "PostalAddress",
          streetAddress: siteConfig.address.replace(/\|/g, ", "),
        },
      }
    : {}),
  ...(mapsHref() ? { hasMap: mapsHref() } : {}),
  knowsAbout: services.map((service) => service.title),
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Visual production services",
    itemListElement: services.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.title,
        description: service.description,
      },
    })),
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${editorial.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Navbar />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
