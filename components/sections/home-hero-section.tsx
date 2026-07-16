import Link from "next/link";
import type { Product } from "@/lib/shopify/types";

type HomeHeroSectionProps = {
  siteName: string;
  heroProduct?: Product | null;
};

export function HomeHeroSection({ siteName }: HomeHeroSectionProps) {
  return (
    <section className="relative min-h-[100svh] overflow-hidden px-5 pb-[90px] pt-[150px] text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_62%_48%_at_50%_38%,rgba(201,150,43,0.20),rgba(201,150,43,0.05)_48%,transparent_72%)]" />
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-50" viewBox="0 0 1400 1000" fill="none" aria-hidden="true">
        <path d="M90 720 C220 620 310 510 430 470 C560 430 650 520 760 500 C860 480 910 370 1030 340 C1152 308 1272 326 1320 400" stroke="rgba(201,150,43,0.18)" strokeWidth="1.2" />
        <path d="M150 250 C290 170 390 120 500 160 C610 200 660 320 770 330 C900 342 980 250 1100 220 C1196 194 1285 196 1350 250" stroke="rgba(201,150,43,0.16)" strokeWidth="1" />
        <path d="M220 680 C340 640 400 560 470 548 C570 532 650 620 740 624 C818 628 912 560 980 542 C1060 520 1180 532 1270 590" stroke="rgba(201,150,43,0.14)" strokeWidth="1" />
        <circle cx="270" cy="170" r="4" fill="rgba(232,195,106,0.55)" />
        <circle cx="910" cy="320" r="4.5" fill="rgba(232,195,106,0.55)" />
        <circle cx="1180" cy="560" r="4.2" fill="rgba(232,195,106,0.55)" />
        <circle cx="620" cy="250" r="3" fill="rgba(232,195,106,0.55)" />
      </svg>
      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-240px)] max-w-[900px] flex-col items-center justify-center">
        <svg className="mx-auto mb-[26px] h-[110px] w-[120px] drop-shadow-[0_0_32px_rgba(201,150,43,0.45)]" viewBox="0 0 120 110" fill="none" aria-hidden="true">
          <path d="M8 6 L60 104 L112 6" stroke="url(#gh)" strokeWidth="9" fill="none" />
          <path d="M24 38 Q60 12 96 38" stroke="url(#gh)" strokeWidth="3.4" fill="none" />
          <line x1="36" y1="27" x2="36" y2="41" stroke="#C9962B" strokeWidth="2" />
          <line x1="60" y1="20" x2="60" y2="44" stroke="#C9962B" strokeWidth="2" />
          <line x1="84" y1="27" x2="84" y2="41" stroke="#C9962B" strokeWidth="2" />
          <path d="M42 62 Q56 74 50 88 Q47 96 54 102" stroke="#C9962B" strokeWidth="2.6" fill="none" />
          <defs>
            <linearGradient id="gh" x1="0" y1="0" x2="120" y2="110">
              <stop stopColor="#F3E3B8" />
              <stop offset="0.5" stopColor="#C9962B" />
              <stop offset="1" stopColor="#8F6A1D" />
            </linearGradient>
          </defs>
        </svg>
        <h1 className="font-display text-[clamp(2.1rem,6.4vw,4.4rem)] uppercase leading-[1.14] tracking-[0.22em] bg-gradient-to-b from-[var(--gold-pale)] via-[var(--gold-light)] to-[var(--gold-deep)] bg-clip-text text-transparent">
          {siteName}
        </h1>
        <div className="mt-[14px] font-display text-[clamp(0.85rem,1.8vw,1.15rem)] uppercase tracking-[0.75em] text-[var(--gold)]">
          G R O U P
        </div>
        <p className="mx-auto mt-[30px] max-w-[620px] font-serif text-[clamp(1.15rem,2.3vw,1.55rem)] italic text-[var(--mist)]">
          Fresh truffles, exquisite saffron and Italian fine foods – from one of Europe’s leading suppliers, serving clients around the world.
        </p>
        <div className="mt-[44px] flex flex-wrap justify-center gap-0">
          <span className="border-r border-[var(--line)] px-[22px] text-[0.72rem] uppercase tracking-[0.34em] text-[var(--gold-light)] last:border-r-0">Truffles</span>
          <span className="border-r border-[var(--line)] px-[22px] text-[0.72rem] uppercase tracking-[0.34em] text-[var(--gold-light)] last:border-r-0">Saffron</span>
          <span className="border-r border-[var(--line)] px-[22px] text-[0.72rem] uppercase tracking-[0.34em] text-[var(--gold-light)] last:border-r-0">Fine Foods</span>
          <span className="px-[22px] text-[0.72rem] uppercase tracking-[0.34em] text-[var(--gold-light)]">Global Trust</span>
        </div>
        <div className="mt-[48px] flex flex-wrap justify-center gap-[18px]">
          <Link href="/shop" className="gold-btn inline-block rounded-none transition duration-300 hover:-translate-y-[1px]">
            Shop now
          </Link>
          <Link href="/search" className="ghost-btn inline-block transition duration-300 hover:-translate-y-[1px]">
            Wholesale inquiry
          </Link>
        </div>
        <p className="mt-[58px] text-[0.68rem] uppercase tracking-[0.3em] text-[var(--text-faint)]">
          Swiss Quality · Global Excellence
        </p>
      </div>
    </section>
  );
}
