import type { Metadata } from "next";
import LocationPageContent, {
  generateLocationPage,
} from "@/components/LocationPageContent";

export const metadata: Metadata = generateLocationPage("plovdiv").metadata;

export default function PlovdivPage() {
  const { location, locationResults } = generateLocationPage("plovdiv");
  return (
    <LocationPageContent location={location} locationResults={locationResults} />
  );
}
