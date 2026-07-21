import type { Metadata } from "next";
import { EditorialPage } from "@/components/content/editorial-page";

const wholesaleEmail = process.env.WHOLESALE_EMAIL ?? process.env.CONTACT_EMAIL ?? "info@valbridgegroup.com";

export const metadata: Metadata = {
  title: "Grosshandel",
  description: "Fragen Sie Verfügbarkeit und Preise für Gastronomie, Handel und Vertrieb bei Valbridge an.",
  alternates: { canonical: "/wholesale" },
};

export default function WholesalePage() {
  const inquiryHref = `mailto:${wholesaleEmail}?subject=Grosshandelsanfrage%20Preisliste`;

  return (
    <EditorialPage
      eyebrow="B2B · Gastronomie · Handel"
      title="Ein verlässlicher Partner für Feinkost"
      intro="Saisonale Verfügbarkeit, ausgewählte Produkte und persönlicher Service für Profiküchen, Hotels, Händler und Vertriebspartner."
      heroNote="Individuelle Angebote · Internationale Anfragen"
      facts={[
        { label: "Für Küchen", value: "Restaurants und Hotels" },
        { label: "Für den Handel", value: "Detailhandel und Vertrieb" },
        { label: "Abgestimmt auf", value: "Markt, Menge und Saison" },
      ]}
      statement={{
        eyebrow: "Professionelle Belieferung",
        title: "Kommerzieller Service mit kompromissloser Aufmerksamkeit für das Produkt.",
        body: "Anforderungen im Grosshandel sind selten standardisiert. Wir richten jedes Angebot nach Produktinteresse, erwarteter Menge, Liefermarkt und Zeitpunkt aus und kommunizieren Verfügbarkeit sowie Konditionen transparent.",
      }}
      capabilities={{
        eyebrow: "Grosshandelssortiment",
        title: "Produkte und Unterstützung für Ihr Unternehmen",
        intro: "Von saisonalen Höhepunkten bis zu verlässlichen Vorratsprodukten unterstützt unser Team Sie bei einer Auswahl, die zu Ihrem Betrieb und Ihren Kunden passt.",
        items: [
          { title: "Frische Saisonprodukte", body: "Verfügbarkeit und Preise frischer Trüffel richten sich nach Saison, Qualität, Herkunft und aktueller Marktlage. Angebote sind daher zeitlich begrenzt." },
          { title: "Auswahl für den Vorrat", body: "Fragen Sie nach Safran, Premiumölen, konservierten Trüffelprodukten, Geschenkformaten und individuellen Sortimenten." },
          { title: "Kommerzielle Beratung", body: "Wir klären geeignete Formate, erwartete Mengen und Produktoptionen für Speisekarte, Regal oder Vertriebsmodell." },
          { title: "Lieferplanung", body: "Mindestmengen, Temperaturanforderungen, Vorlaufzeiten und verfügbare Lieferdienste werden für Ihr Ziel bestätigt." },
        ],
      }}
      process={{
        eyebrow: "So starten Sie",
        title: "Von der Anfrage bis zur bestätigten Lieferung",
        items: [
          { title: "Bedarf mitteilen", body: "Nennen Sie uns Unternehmen, Markt, Lieferland, Produktinteressen und erwartete Mengen." },
          { title: "Verfügbarkeit prüfen", body: "Wir beurteilen das aktuelle Sortiment, die Saisonalität und geeignete Optionen für Ihren Bedarf." },
          { title: "Angebot erhalten", body: "Preise, Mindestmengen, Vorlaufzeiten und Lieferbedingungen werden übersichtlich dargestellt." },
          { title: "Lieferung bestätigen", body: "Nach Ihrer Bestätigung koordinieren wir Handhabung und Versand passend zu Produkt und Zielort." },
        ],
      }}
      closing={{
        eyebrow: "Gespräch beginnen",
        title: "Teilen Sie uns Ihren Bedarf mit",
        body: "Nennen Sie Unternehmen, Zielort, gewünschte Produkte, geschätzte Mengen und Lieferzeitraum für eine möglichst konkrete erste Antwort.",
        primaryAction: { href: inquiryHref, label: "Preisliste anfordern" },
        secondaryAction: { href: "/shop", label: "Kollektion ansehen" },
      }}
    />
  );
}
