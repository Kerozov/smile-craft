import Link from "next/link";
import { locationList } from "@/lib/locations";
import { cn } from "@/lib/utils";

interface CityLinksProps {
  className?: string;
  linkClassName?: string;
  separator?: string;
  separatorClassName?: string;
}

/** Internal links to each city page — better for local SEO than plain text */
export default function CityLinks({
  className,
  linkClassName,
  separator = "·",
  separatorClassName,
}: CityLinksProps) {
  return (
    <nav
      className={cn("inline-flex flex-wrap items-center justify-center gap-x-2", className)}
      aria-label="Кабинети по градове"
    >
      {locationList.map((loc, i) => (
        <span key={loc.slug} className="inline-flex items-center gap-x-2">
          {i > 0 && (
            <span
              className={cn("text-beige-primary/50", separatorClassName)}
              aria-hidden="true"
            >
              {separator}
            </span>
          )}
          <Link
            href={`/${loc.slug}`}
            className={cn(
              "transition-colors hover:text-beige-deep hover:underline underline-offset-4",
              linkClassName
            )}
          >
            {loc.nameBg}
          </Link>
        </span>
      ))}
    </nav>
  );
}
