import type { Metadata } from "next";
import { InfoPage } from "@/components/content/info-page";

export const metadata: Metadata = { title: "About", description: "Learn about Valbridge Group's Swiss-led sourcing and international fine-food network.", alternates: { canonical: "/about" } };

export default function AboutPage() {
  return <InfoPage eyebrow="Valbridge Group" title="A bridge from origin to table" intro="From the Canton of Bern, we connect distinguished growers and producers with restaurants, retailers, and private clients around the world." sections={[
    { title: "Direct relationships", body: "We work with specialist producers and regional partners across Europe and selected origin markets, prioritizing provenance and dependable quality." },
    { title: "Swiss standards", body: "Every selection is handled with careful quality control, clear communication, and logistics designed for premium and perishable goods." },
    { title: "Hospitality experience", body: "Our range supports chefs, hotels, retailers, distributors, and discerning home kitchens with both seasonal and pantry products." },
    { title: "International service", body: "We coordinate worldwide inquiries and provide tailored guidance for market, quantity, season, and delivery requirements." },
  ]} action={{ href: "/wholesale", label: "Wholesale inquiries" }} />;
}
