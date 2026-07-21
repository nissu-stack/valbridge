import Link from "next/link";

export function HomeStandardSection() {
  return (
    <>
      <section className="border-y border-[var(--line-soft)] bg-[var(--coal)] px-4 py-[clamp(70px,9vw,120px)] sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1240px] gap-[clamp(38px,6vw,84px)] lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <span className="text-[0.72rem] font-medium uppercase tracking-[0.42em] text-[var(--gold)]">Die Valbridge Group</span>
            <h2 className="font-display mt-3 text-[clamp(1.7rem,3.6vw,2.7rem)] uppercase tracking-[0.14em] text-[var(--gold-pale)]">Eine Brücke zwischen den besten Terroirs und Ihrer Küche</h2>
            <p className="mt-4 font-serif text-[1.14rem] text-[var(--mist)]">
              Von unserem Standort im Kanton Bern verbinden wir die renommiertesten Trüffelregionen Italiens und Europas mit anspruchsvollen Kunden weltweit – von Michelin-Restaurants bis zu privaten Geniessern.
            </p>
            <p className="mt-4 font-serif text-[1.14rem] text-[var(--mist)]">
              Als einer der grössten Trüffellieferanten Europas beziehen wir direkt am Ursprung und prüfen jede Lieferung von Hand mit Schweizer Präzision.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-px border border-[var(--line-soft)] bg-[var(--line-soft)]">
            <div className="bg-[var(--coal)] p-[30px_26px]">
              <h3 className="font-display text-[0.86rem] uppercase tracking-[0.2em] text-[var(--gold-light)]">Direkter Einkauf</h3>
              <p className="mt-2 text-[0.86rem] text-[var(--mist)]">Partnerschaften mit Trüffelsuchern und Produzenten in Italien, Frankreich und Spanien.</p>
            </div>
            <div className="bg-[var(--coal)] p-[30px_26px]">
              <h3 className="font-display text-[0.86rem] uppercase tracking-[0.2em] text-[var(--gold-light)]">Frischegarantie</h3>
              <p className="mt-2 text-[0.86rem] text-[var(--mist)]">Frische Trüffel werden nach Ihrer Bestellung ausgewählt und per Expresskurier versandt.</p>
            </div>
            <div className="bg-[var(--coal)] p-[30px_26px]">
              <h3 className="font-display text-[0.86rem] uppercase tracking-[0.2em] text-[var(--gold-light)]">Weltweite Lieferung</h3>
              <p className="mt-2 text-[0.86rem] text-[var(--mist)]">Temperaturgeführte Logistik nach Europa, in die USA, den Nahen Osten und nach Asien.</p>
            </div>
            <div className="bg-[var(--coal)] p-[30px_26px]">
              <h3 className="font-display text-[0.86rem] uppercase tracking-[0.2em] text-[var(--gold-light)]">B2B-Konditionen</h3>
              <p className="mt-2 text-[0.86rem] text-[var(--mist)]">Attraktive Mengenpreise für Restaurants, Hotels und Vertriebspartner.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-4 py-[clamp(70px,9vw,120px)] text-center sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_70%_at_50%_50%,rgba(201,150,43,0.13),transparent_70%)]" />
        <div className="relative mx-auto max-w-[1240px]">
          <span className="text-[0.72rem] font-medium uppercase tracking-[0.42em] text-[var(--gold)]">Für Restaurants · Hotels · Handel</span>
          <h2 className="mx-auto mt-4 max-w-[820px] font-display text-[clamp(1.5rem,3vw,2.3rem)] uppercase tracking-[0.16em] text-[var(--gold-pale)]">
            Ihr Partner für Trüffel im Grosshandel
          </h2>
          <p className="mx-auto mt-5 max-w-[640px] font-serif text-[1.2rem] italic text-[var(--mist)]">
            Tagesaktuelle Preise, zuverlässige Verfügbarkeit in der Saison und ein vollständiges Sortiment für Ihre Speisekarte oder Ihr Regal.
          </p>
          <Link href="/wholesale" className="site-button site-button--primary mt-9">
            Preisliste anfordern
          </Link>
        </div>
      </section>
    </>
  );
}
