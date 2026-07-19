import type { Metadata } from "next";
import { InfoPage } from "@/components/content/info-page";

const wholesaleEmail = process.env.WHOLESALE_EMAIL ?? process.env.CONTACT_EMAIL ?? "info@valbridgegroup.com";
export const metadata: Metadata = { title: "Wholesale", description: "Request Valbridge wholesale availability and pricing for hospitality, retail, and distribution.", alternates: { canonical: "/wholesale" } };

export default function WholesalePage() {
  return <InfoPage eyebrow="B2B · Hospitality · Retail" title="Wholesale fine-food supply" intro="Request seasonal availability, indicative pricing, and delivery options for your restaurant, hotel, retail, or distribution business." sections={[
    { title: "What to include", body: "Share your company, market, delivery country, product interests, expected quantities, and required delivery window." },
    { title: "Seasonal products", body: "Fresh-truffle availability and pricing change with season, grade, origin, and market conditions. Quotes are therefore time-limited." },
    { title: "Pantry range", body: "Ask about saffron, oils, preserved truffle products, gift formats, and tailored product selections." },
    { title: "Logistics", body: "We will confirm minimum quantities, temperature requirements, lead times, and available delivery services for your destination." },
  ]} action={{ href: `mailto:${wholesaleEmail}?subject=Wholesale%20price%20list%20request`, label: "Request the price list" }} />;
}
