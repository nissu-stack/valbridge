import Link from "next/link";

type InfoSection = { title: string; body: string };

export function InfoPage({ eyebrow, title, intro, sections, action }: { eyebrow: string; title: string; intro: string; sections: InfoSection[]; action?: { href: string; label: string } }) {
  return (
    <main id="main-content" className="min-h-screen pt-[76px]">
      <header className="relative overflow-hidden bg-[var(--obsidian)] px-4 py-[clamp(90px,12vw,160px)] text-center sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_70%_at_50%_42%,rgba(201,150,43,0.14),transparent_72%)]" />
        <div className="relative mx-auto max-w-[960px]">
          <p className="text-xs uppercase tracking-[0.42em] text-[var(--gold)]">{eyebrow}</p>
          <h1 className="mt-5 font-display text-[clamp(2.2rem,6vw,4.5rem)] uppercase leading-[1.15] tracking-[0.14em] text-[var(--gold-pale)]">{title}</h1>
          <p className="mx-auto mt-7 max-w-3xl font-serif text-[clamp(1.15rem,2.4vw,1.5rem)] leading-8 text-[var(--mist)]">{intro}</p>
          {action ? <Link href={action.href} className="mt-10 inline-flex bg-[linear-gradient(135deg,var(--gold-deep),var(--gold)_45%,var(--gold-light))] px-9 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--obsidian)] transition hover:-translate-y-px">{action.label}</Link> : null}
        </div>
      </header>

      {sections.map((section, index) => (
          <section key={section.title} className={`${index % 2 === 0 ? "bg-[var(--coal)]" : "bg-[var(--obsidian)]"} px-4 py-[clamp(64px,8vw,104px)] sm:px-6 lg:px-8`}>
            <div className="mx-auto grid max-w-[1240px] gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-start md:gap-16">
              <div>
                <p className="text-xs uppercase tracking-[0.34em] text-[var(--gold)]">{String(index + 1).padStart(2, "0")}</p>
                <h2 className="mt-3 font-display text-[clamp(1.45rem,3vw,2.25rem)] uppercase tracking-[0.12em] text-[var(--gold-light)]">{section.title}</h2>
              </div>
              <p className="font-serif text-[clamp(1.05rem,2vw,1.3rem)] leading-9 text-[var(--mist)]">{section.body}</p>
            </div>
          </section>
      ))}
    </main>
  );
}
