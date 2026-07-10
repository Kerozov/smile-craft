import type { Metadata } from "next";
import { Fraunces, Inter, Space_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/utils";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Smile Craft — Д-р Ани Овардова | Бутикова дентална практика",
    template: "%s | Smile Craft",
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: "bg_BG",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "Smile Craft — Д-р Ани Овардова",
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Smile Craft — Д-р Ани Овардова",
    description: siteConfig.description,
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  founder: {
    "@type": "Person",
    name: siteConfig.doctor,
    jobTitle: "Зъболекар",
  },
  areaServed: ["Пловдив", "Рудозем", "Девин"],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: siteConfig.phone,
    email: siteConfig.email,
    contactType: "customer service",
    availableLanguage: "Bulgarian",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bg"
      className={`${fraunces.variable} ${inter.variable} ${spaceMono.variable} h-full`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
