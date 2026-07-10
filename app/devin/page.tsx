import type { Metadata } from "next";
import LocationPageContent, {
  generateLocationPage,
} from "@/components/LocationPageContent";

export const metadata: Metadata = generateLocationPage("devin").metadata;

export default function DevinPage() {
  const { location, locationResults } = generateLocationPage("devin");
  return (
    <LocationPageContent location={location} locationResults={locationResults} />
  );
}
