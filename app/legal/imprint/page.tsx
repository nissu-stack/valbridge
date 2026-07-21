import { InfoPage } from "@/components/content/info-page";

export default function ImprintPage() {
  return <InfoPage eyebrow="Rechtliches" title="Impressum" intro="Unternehmens- und Anbieterinformationen für den Valbridge-Onlineshop." sections={[
    { title: "Erforderliche Angaben", body: "Vor der Veröffentlichung sind die eingetragene Rechtseinheit, vollständige Anschrift, Registernummer, Mehrwertsteuernummer, vertretungsberechtigte Person und offizielle Kontaktdaten einzufügen." },
    { title: "Hosting und Betrieb", body: "Onlineshop-Betreiber, Hosting-Anbieter und verantwortliche Kontaktstelle sind gemäss den bedienten Rechtsgebieten zu dokumentieren." },
  ]} />;
}
