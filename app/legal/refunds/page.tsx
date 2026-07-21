import { InfoPage } from "@/components/content/info-page";

export default function RefundsPage() {
  return <InfoPage eyebrow="Kundenservice" title="Rückerstattungsrichtlinie" intro="Kontaktieren Sie uns umgehend, wenn eine Bestellung beschädigt, unvollständig oder wesentlich anders als bestätigt eintrifft." sections={[
    { title: "Verderbliche Produkte", body: "Probleme mit frischen und verderblichen Waren müssen rasch unter Angabe von Bestellreferenz, Lieferzeit, Verpackungszustand und aussagekräftigen Fotos gemeldet werden. Die endgültigen Bedingungen müssen dem anwendbaren Konsumentenrecht entsprechen." },
    { title: "Andere Produkte", body: "Vor der Veröffentlichung sind Stornierung, Rückgabeberechtigung, Rückgabefreigabe, Zustandsanforderungen, Rückversand, Prüfung und Rückerstattungsfrist zu dokumentieren." },
  ]} />;
}
