export function HomeBenefitsSection() {
  return (
    <section className="border-y border-[var(--line-soft)] bg-[var(--coal)]">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-px md:grid-cols-2 lg:grid-cols-4">
        <div className="px-5 py-8 text-center sm:px-6 lg:px-8">
          <div className="font-display text-[1.7rem] tracking-[0.06em] text-[var(--gold-light)]">24–48h</div>
          <div className="mt-2 text-[0.68rem] uppercase tracking-[0.26em] text-[var(--mist)]">Express weltweit</div>
        </div>
        <div className="px-5 py-8 text-center sm:px-6 lg:px-8">
          <div className="font-display text-[1.7rem] tracking-[0.06em] text-[var(--gold-light)]">5</div>
          <div className="mt-2 text-[0.68rem] uppercase tracking-[0.26em] text-[var(--mist)]">Sprachen · Beratung</div>
        </div>
        <div className="px-5 py-8 text-center sm:px-6 lg:px-8">
          <div className="font-display text-[1.7rem] tracking-[0.06em] text-[var(--gold-light)]">🇨🇭</div>
          <div className="mt-2 text-[0.68rem] uppercase tracking-[0.26em] text-[var(--mist)]">Schweizer Qualität</div>
        </div>
        <div className="px-5 py-8 text-center sm:px-6 lg:px-8">
          <div className="font-display text-[1.7rem] tracking-[0.06em] text-[var(--gold-light)]">B2B+B2C</div>
          <div className="mt-2 text-[0.68rem] uppercase tracking-[0.26em] text-[var(--mist)]">Gastronomie & Privatkunden</div>
        </div>
      </div>
    </section>
  );
}
