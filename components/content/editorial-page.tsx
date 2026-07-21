import Link from "next/link";
import { ArrowRight } from "lucide-react";

type EditorialItem = {
  title: string;
  body: string;
};

type EditorialPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  heroNote: string;
  facts: Array<{ label: string; value: string }>;
  statement: {
    eyebrow: string;
    title: string;
    body: string;
  };
  capabilities: {
    eyebrow: string;
    title: string;
    intro: string;
    items: EditorialItem[];
  };
  process: {
    eyebrow: string;
    title: string;
    items: EditorialItem[];
  };
  closing: {
    eyebrow: string;
    title: string;
    body: string;
    primaryAction: { href: string; label: string };
    secondaryAction?: { href: string; label: string };
  };
};

export function EditorialPage({ eyebrow, title, intro, heroNote, facts, statement, capabilities, process, closing }: EditorialPageProps) {
  return (
    <main id="main-content" className="min-h-screen pt-[76px]">
      <header className="relative overflow-hidden bg-[var(--obsidian)] px-5 py-[clamp(72px,10vw,132px)] sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_48%_70%_at_78%_40%,rgba(201,150,43,0.14),transparent_72%)]" />
        <div className="relative mx-auto grid max-w-[1240px] gap-14 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] lg:items-end">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="mt-5 max-w-4xl font-display text-[clamp(2.55rem,6.5vw,5.8rem)] uppercase leading-[1.02] tracking-[0.08em] text-[var(--gold-pale)]">
              {title}
            </h1>
          </div>
          <div className="lg:pb-2">
            <p className="font-serif text-[clamp(1.2rem,2.2vw,1.55rem)] leading-[1.55] text-[var(--cream-dim)]">{intro}</p>
            <p className="mt-7 text-[0.68rem] font-medium uppercase leading-6 tracking-[0.24em] text-[var(--gold)]">{heroNote}</p>
          </div>
        </div>
      </header>

      <section aria-label="At a glance" className="bg-[var(--coal)] px-5 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1240px] gap-8 sm:grid-cols-3 sm:gap-10">
          {facts.map((fact) => (
            <div key={fact.label}>
              <p className="text-[0.64rem] font-medium uppercase tracking-[0.28em] text-[var(--gold)]">{fact.label}</p>
              <p className="mt-2 font-display text-[clamp(1rem,2vw,1.3rem)] uppercase leading-7 tracking-[0.09em] text-[var(--cream)]">{fact.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[var(--panel)] px-5 py-[clamp(76px,10vw,136px)] sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[0.55fr_1.45fr] lg:gap-20">
          <p className="eyebrow pt-2">{statement.eyebrow}</p>
          <div>
            <h2 className="max-w-4xl font-display text-[clamp(2rem,4.5vw,4rem)] uppercase leading-[1.15] tracking-[0.1em] text-[var(--gold-pale)]">{statement.title}</h2>
            <p className="mt-7 max-w-3xl font-serif text-[clamp(1.15rem,2vw,1.4rem)] leading-9 text-[var(--mist)]">{statement.body}</p>
          </div>
        </div>
      </section>

      <section className="bg-[var(--obsidian)] px-5 py-[clamp(76px,10vw,132px)] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-20">
            <div>
              <p className="eyebrow">{capabilities.eyebrow}</p>
              <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,3.3rem)] uppercase leading-[1.18] tracking-[0.1em] text-[var(--gold-pale)]">{capabilities.title}</h2>
            </div>
            <p className="max-w-2xl font-serif text-xl leading-8 text-[var(--mist)]">{capabilities.intro}</p>
          </div>

          <div className="mt-[clamp(52px,7vw,88px)] grid gap-x-14 gap-y-14 md:grid-cols-2">
            {capabilities.items.map((item, index) => (
              <article key={item.title} className="grid grid-cols-[46px_minmax(0,1fr)] gap-5">
                <span className="font-display text-2xl text-[var(--gold-deep)]" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="font-display text-lg uppercase tracking-[0.12em] text-[var(--gold-light)]">{item.title}</h3>
                  <p className="mt-3 max-w-xl text-[0.95rem] leading-7 text-[var(--mist)]">{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--coal)] px-5 py-[clamp(76px,9vw,120px)] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1240px]">
          <p className="eyebrow">{process.eyebrow}</p>
          <h2 className="mt-4 max-w-3xl font-display text-[clamp(1.9rem,4vw,3.2rem)] uppercase leading-[1.2] tracking-[0.1em] text-[var(--gold-pale)]">{process.title}</h2>
          <ol className="mt-[clamp(48px,7vw,76px)] grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {process.items.map((item, index) => (
              <li key={item.title} className="relative pr-4">
                <div className="flex items-center gap-4 text-[var(--gold)]">
                  <span className="text-[0.68rem] font-medium uppercase tracking-[0.26em]">Step {String(index + 1).padStart(2, "0")}</span>
                  {index < process.items.length - 1 ? <ArrowRight className="hidden h-4 w-4 lg:block" strokeWidth={1.25} aria-hidden="true" /> : null}
                </div>
                <h3 className="mt-5 font-display text-base uppercase tracking-[0.1em] text-[var(--cream)]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--mist)]">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[var(--panel)] px-5 py-[clamp(80px,11vw,144px)] sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_85%_at_50%_110%,rgba(201,150,43,0.16),transparent_70%)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="eyebrow">{closing.eyebrow}</p>
          <h2 className="mt-5 font-display text-[clamp(2rem,5vw,4.2rem)] uppercase leading-[1.14] tracking-[0.1em] text-[var(--gold-pale)]">{closing.title}</h2>
          <p className="mx-auto mt-6 max-w-2xl font-serif text-xl leading-8 text-[var(--mist)]">{closing.body}</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href={closing.primaryAction.href} className="site-button site-button--primary min-w-56">
              {closing.primaryAction.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            {closing.secondaryAction ? (
              <Link href={closing.secondaryAction.href} className="site-button site-button--secondary min-w-56">{closing.secondaryAction.label}</Link>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
