import Link from "next/link";

export function HomeStandardSection() {
  return (
    <>
      <section className="border-y border-[var(--line-soft)] bg-[var(--coal)] px-4 py-[clamp(70px,9vw,120px)] sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1240px] gap-[clamp(38px,6vw,84px)] lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <span className="text-[0.72rem] font-medium uppercase tracking-[0.42em] text-[var(--gold)]">The Valbridge Group</span>
            <h2 className="font-display mt-3 text-[clamp(1.7rem,3.6vw,2.7rem)] uppercase tracking-[0.14em] text-[var(--gold-pale)]">A bridge between the finest terroirs and your kitchen</h2>
            <p className="mt-4 font-serif text-[1.14rem] text-[var(--mist)]">
              From our base in the Canton of Bern, we connect the most renowned truffle regions of Italy and Europe with discerning customers worldwide — from Michelin restaurants to private connoisseurs.
            </p>
            <p className="mt-4 font-serif text-[1.14rem] text-[var(--mist)]">
              As one of Europe’s largest truffle suppliers, we source directly at origin and hand-check every shipment with Swiss precision.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-px border border-[var(--line-soft)] bg-[var(--line-soft)]">
            <div className="bg-[var(--coal)] p-[30px_26px]">
              <h3 className="font-display text-[0.86rem] uppercase tracking-[0.2em] text-[var(--gold-light)]">Direct sourcing</h3>
              <p className="mt-2 text-[0.86rem] text-[var(--mist)]">Partnerships with truffle hunters and manufacturers in Italy, France and Spain.</p>
            </div>
            <div className="bg-[var(--coal)] p-[30px_26px]">
              <h3 className="font-display text-[0.86rem] uppercase tracking-[0.2em] text-[var(--gold-light)]">Freshness guarantee</h3>
              <p className="mt-2 text-[0.86rem] text-[var(--mist)]">Fresh truffles are selected after your order and shipped by express courier.</p>
            </div>
            <div className="bg-[var(--coal)] p-[30px_26px]">
              <h3 className="font-display text-[0.86rem] uppercase tracking-[0.2em] text-[var(--gold-light)]">Worldwide delivery</h3>
              <p className="mt-2 text-[0.86rem] text-[var(--mist)]">Temperature-controlled logistics to Europe, the USA, the Middle East and Asia.</p>
            </div>
            <div className="bg-[var(--coal)] p-[30px_26px]">
              <h3 className="font-display text-[0.86rem] uppercase tracking-[0.2em] text-[var(--gold-light)]">B2B terms</h3>
              <p className="mt-2 text-[0.86rem] text-[var(--mist)]">Attractive volume pricing for restaurants, hotels and distributors.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-4 py-[clamp(70px,9vw,120px)] text-center sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_70%_at_50%_50%,rgba(201,150,43,0.13),transparent_70%)]" />
        <div className="relative mx-auto max-w-[1240px]">
          <span className="text-[0.72rem] font-medium uppercase tracking-[0.42em] text-[var(--gold)]">For restaurants · hotels · trade</span>
          <h2 className="mx-auto mt-4 max-w-[820px] font-display text-[clamp(1.5rem,3vw,2.3rem)] uppercase tracking-[0.16em] text-[var(--gold-pale)]">
            Your partner for wholesale truffles
          </h2>
          <p className="mx-auto mt-5 max-w-[640px] font-serif text-[1.2rem] italic text-[var(--mist)]">
            Daily pricing, reliable availability in season and a complete product line for your menu or your shelf.
          </p>
          <Link href="/wholesale" className="mt-9 inline-block bg-[linear-gradient(135deg,var(--gold-deep),var(--gold)_45%,var(--gold-light))] px-[38px] py-[16px] text-[0.8rem] font-semibold uppercase tracking-[0.28em] text-[var(--obsidian)] transition duration-300 hover:-translate-y-[1px] hover:shadow-[0_6px_30px_rgba(201,150,43,0.45)]">
            Request price list
          </Link>
        </div>
      </section>
    </>
  );
}
