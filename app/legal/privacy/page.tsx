import { InfoPage } from "@/components/content/info-page";

export default function PrivacyPage() {
  return <InfoPage eyebrow="Rechtliches" title="Datenschutzerklärung" intro="Informationen zur Verarbeitung personenbezogener Daten in diesem Onlineshop." sections={[
    { title: "Freigabe erforderlich", body: "Vor der Veröffentlichung ist eine rechtlich geprüfte Erklärung zu Shopify, Hosting, Analyse, Zahlungen, Kommunikation, Aufbewahrung, internationalen Übermittlungen und Kundenrechten bereitzustellen." },
    { title: "Datenschutzanfragen", body: "Die verantwortliche Datenschutzkontaktstelle und das Verfahren für Auskunft, Berichtigung, Löschung, Widerspruch und weitere anwendbare Rechte sind zu ergänzen." },
  ]} />;
}
