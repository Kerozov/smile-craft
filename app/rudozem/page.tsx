import type { Metadata } from "next";
import LocationPageContent, {
  generateLocationPage,
} from "@/components/LocationPageContent";

export const metadata: Metadata = generateLocationPage("rudozem").metadata;

export default function RudozemPage() {
  const { location, locationResults } = generateLocationPage("rudozem");
  return (
    <LocationPageContent location={location} locationResults={locationResults} />
  );
}
