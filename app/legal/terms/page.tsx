import { InfoPage } from "@/components/content/info-page";

export default function TermsPage() {
  return <InfoPage eyebrow="Rechtliches" title="Allgemeine Geschäftsbedingungen" intro="Geschäftsbedingungen für Einkäufe im Onlineshop und die Pflichten der Kundschaft." sections={[
    { title: "Freigabe erforderlich", body: "Die endgültigen Bedingungen müssen von einer qualifizierten Rechtsberatung erstellt oder freigegeben und mit Shopify-Checkout, Preisgestaltung, Zahlung, Lieferung, Zoll und Stornierungsabläufen abgestimmt werden." },
    { title: "Vor der Veröffentlichung", body: "Anwendbares Recht, Vertragsabschluss, Preisgestaltung, Zahlung, Erfüllung, Haftung, Gewährleistung und Streitbeilegung sind zu ergänzen." },
  ]} />;
}
