import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/plovdiv",
    "/rudozem",
    "/devin",
    "/uslugi",
    "/za-nas",
    "/rezultati",
    "/zapazi-chas",
  ];

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.includes("plovdiv") || route.includes("rudozem") || route.includes("devin") ? 0.9 : 0.8,
  }));
}
