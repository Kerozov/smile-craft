import type { Location } from "@/lib/locations";
import { siteConfig } from "@/lib/utils";

interface LocalBusinessSchemaProps {
  location: Location;
}

export default function LocalBusinessSchema({
  location,
}: LocalBusinessSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: `Smile Craft — ${location.nameBg}`,
    description: location.intro,
    url: `${siteConfig.url}/${location.slug}`,
    telephone: location.phone,
    email: location.email,
    image: `${siteConfig.url}/og-image.jpg`,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: location.address,
      addressLocality: location.city,
      postalCode: location.postalCode,
      addressCountry: "BG",
    },
    geo: {
      "@type": "GeoCoordinates",
      addressCountry: "BG",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "19:00",
      },
    ],
    parentOrganization: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
