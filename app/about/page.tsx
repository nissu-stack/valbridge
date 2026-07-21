import type { Metadata } from "next";
import { EditorialPage } from "@/components/content/editorial-page";

export const metadata: Metadata = {
  title: "Über uns",
  description: "Erfahren Sie mehr über die Schweizer Beschaffungskompetenz und das internationale Feinkostnetzwerk der Valbridge Group.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <EditorialPage
      eyebrow="Valbridge Group · Kanton Bern"
      title="Eine Brücke vom Ursprung bis auf den Tisch"
      intro="Wir verbinden ausgewählte Produzenten mit Köchen, Händlern und Privatkunden, die Herkunft, Beständigkeit und aussergewöhnlichen Geschmack schätzen."
      heroNote="Schweizer Beschaffung · Internationaler Service"
      facts={[
        { label: "Unser Standort", value: "Kanton Bern, Schweiz" },
        { label: "Unser Fokus", value: "Trüffel, Safran und Feinkost" },
        { label: "Unsere Kunden", value: "Gastronomie, Handel und Privatkunden" },
      ]}
      statement={{
        eyebrow: "Unsere Haltung",
        title: "Erstklassige Lebensmittel entstehen durch Beziehungen, nicht durch Abkürzungen.",
        body: "Wir betrachten mehr als nur das Produkt: die Menschen, Orte und Entscheidungen, die es prägen. Das bedeutet durchdachte Beschaffung, ehrliche Kommunikation und sorgfältige Handhabung vom ersten Gespräch bis zur Lieferung.",
      }}
      capabilities={{
        eyebrow: "Unsere Arbeitsweise",
        title: "Sorgfalt bei jedem Schritt",
        intro: "Eine fokussierte Arbeitsweise, die Qualität schützt und aussergewöhnliche Zutaten einfacher zugänglich macht.",
        items: [
          { title: "Beziehungen am Ursprung", body: "Wir arbeiten mit spezialisierten Produzenten und regionalen Partnern in Europa und ausgewählten Herkunftsmärkten zusammen. Herkunft und verlässliche Qualität stehen dabei im Mittelpunkt." },
          { title: "Konsequente Auswahl", body: "Geschmack, Zustand und Eignung werden sorgfältig beurteilt, bevor ein Produkt Teil des Valbridge-Sortiments wird." },
          { title: "Sorgfältige Logistik", body: "Hochwertige und verderbliche Waren erhalten die zeitliche, verpackungstechnische und logistische Aufmerksamkeit, die ihr Charakter verlangt." },
          { title: "Persönlicher Service", body: "Unsere Beratung richtet sich nach Kunde, Markt, Saison und Anlass – für Profiküche, Verkaufsregal oder privaten Tisch." },
        ],
      }}
      process={{
        eyebrow: "Von der Quelle bis zum Service",
        title: "Ein klarer Weg zu aussergewöhnlichen Zutaten",
        items: [
          { title: "Entdecken", body: "Produzenten, Regionen und Produkte mit eigenständiger Geschichte und glaubwürdiger Herkunft identifizieren." },
          { title: "Auswählen", body: "Qualität, Saisonalität und Übereinstimmung mit den Erwartungen unserer Kunden beurteilen." },
          { title: "Koordinieren", body: "Mengen, Handhabung und Lieferung auf die Anforderungen jeder Bestellung abstimmen." },
          { title: "Begleiten", body: "Vor, während und nach der Lieferung mit praktischer Beratung erreichbar bleiben." },
        ],
      }}
      closing={{
        eyebrow: "Mit Valbridge arbeiten",
        title: "Ausgewählte Zutaten für Ihren Tisch",
        body: "Entdecken Sie die Kollektion oder sprechen Sie mit uns über die Beschaffung für Gastronomie, Handel und Vertrieb.",
        primaryAction: { href: "/shop", label: "Kollektion entdecken" },
        secondaryAction: { href: "/wholesale", label: "Grosshandelsanfrage" },
      }}
    />
  );
}
