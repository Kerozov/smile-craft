import type { Metadata, Viewport } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import { siteConfig } from "@/lib/utils";
import "./globals.css";

const display = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

// Poppins няма кирилица — текстът падаше на системен шрифт. Manrope я има.
const body = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#FBF8F3",
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Smile Craft — Д-р Ани Овардова | Дентална практика",
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
      className={`${display.variable} ${body.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <SmoothScroll />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
