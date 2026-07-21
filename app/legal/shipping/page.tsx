import { InfoPage } from "@/components/content/info-page";

export default function ShippingPage() {
  return <InfoPage eyebrow="Kundenservice" title="Versandinformationen" intro="Lieferoptionen richten sich nach Zielort, Produktart, Saison und Zollanforderungen." sections={[
    { title: "Frische Produkte", body: "Frische und temperaturempfindliche Waren können eine Expresslieferung und zielortspezifische Einfuhrprüfungen erfordern. Die endgültige Verfügbarkeit wird beim Checkout oder direkt durch unser Team bestätigt." },
    { title: "Zoll und Abgaben", body: "Internationale Kunden sollten die lokalen Einfuhrbestimmungen prüfen. Zölle, Steuern, Einschränkungen und Abfertigungszeiten können je nach Zielort variieren." },
  ]} />;
}
