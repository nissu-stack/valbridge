import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { ProductGrid } from "@/components/product/product-grid";
import { shopifyClient } from "@/lib/shopify/client";
import { HOMEPAGE_PRODUCTS_QUERY } from "@/lib/shopify/queries";
import type { Product } from "@/lib/shopify/types";

const siteName = process.env.SITE_NAME ?? "Maison Valbridge";
const PAGE_SIZE = 8;

type HomePageProductsQueryData = {
  products: {
    nodes: Product[];
  };
};

const trustItems = [
  { label: "Active lots", value: "10" },
  { label: "Origin countries", value: "4" },
  { label: "Cold-chain dispatch", value: "48h" },
];

const focusCards = [
  {
    icon: Leaf,
    title: "Cold-extracted, always",
    copy: "Every bottle is pressed below 25°C to protect aroma and character.",
  },
  {
    icon: ShieldCheck,
    title: "Single-origin traceability",
    copy: "Each selection is batch-dated and linked to a named grower or mill.",
  },
];

export default async function HomePage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams;
  const requestedPage = Number(params.page ?? "1");
  const data = await shopifyClient.request<HomePageProductsQueryData>(HOMEPAGE_PRODUCTS_QUERY, { first: 24 });
  const allProducts = data.products.nodes;
  const totalPages = Math.max(1, Math.ceil(allProducts.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(requestedPage, 1), totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const visibleProducts = allProducts.slice(startIndex, startIndex + PAGE_SIZE);
  const heroProduct = allProducts[0];
  const featuredOrigins = ["Picual olives · Jaén, Spain", "Saffron threads · Khorasan, Iran", "Hojiblanca olives · Córdoba, Spain", "Summer truffle · Umbria, Italy"];

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <section className="overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[radial-gradient(ellipse_120%_80%_at_20%_10%,rgba(224,184,118,0.18),transparent_55%),linear-gradient(155deg,#1f1c15_0%,#100e0b_65%)] shadow-[0_30px_120px_-50px_rgba(0,0,0,0.85)]">
        <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:p-14">
          <div className="flex flex-col justify-between gap-8">
            <div className="space-y-5">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold-bright)]">{siteName}</p>
              <h1 className="font-display max-w-2xl text-4xl font-semibold leading-[1.04] tracking-[-0.01em] sm:text-5xl lg:text-[56px]">
                Rare pantry pieces, <span className="text-[var(--gold-bright)]">traced to the field</span> they grew in.
              </h1>
              <p className="max-w-xl text-base leading-8 text-[var(--cream-dim)] sm:text-lg">
                Discover seasonal oils, saffron, and pantry staples sourced from named growers and shipped with care.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/shop" className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--gold)] px-5 py-3 text-sm font-semibold text-[var(--obsidian)] transition hover:bg-[var(--gold-bright)]">
                Shop the harvest <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/search" className="inline-flex items-center justify-center rounded-full border border-[var(--line-bright)] px-5 py-3 text-sm font-semibold text-[var(--cream)] transition hover:bg-[rgba(255,255,255,0.05)]">
                Our sourcing story
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 border-t border-[var(--line)] pt-6 text-sm text-[var(--text-faint)]">
              {trustItems.map((item) => (
                <div key={item.label}>
                  <div className="font-display text-xl font-semibold text-[var(--cream)]">{item.value}</div>
                  <div>{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[340px] overflow-hidden rounded-[1.5rem] border border-[var(--line)] bg-[var(--panel)]">
            <div className="absolute right-4 top-4 z-10 rounded-[0.85rem] bg-[var(--cream)] px-3 py-2 text-[11px] font-semibold leading-5 text-[var(--obsidian)] shadow-lg">
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#7a8a5a]" />
              PICUAL OLIVE
              <div className="font-display mt-1 text-[13px]">Harvested Oct 8–17</div>
            </div>
            <div className="absolute inset-0 flex items-end">
              {heroProduct?.featuredImage ? (
                <Image
                  src={heroProduct.featuredImage.url}
                  alt={heroProduct.featuredImage.altText ?? heroProduct.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-[var(--mut)]">Featured product preview</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="relative z-10 w-full p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--gold-bright)]">Featured lot · {heroProduct?.title ?? "New arrivals"}</p>
                <h2 className="font-display mt-2 text-xl font-semibold text-[var(--cream)]">{heroProduct?.title ?? "A seasonal selection"}</h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--panel)] p-8 shadow-[0_20px_80px_-40px_rgba(0,0,0,0.7)] sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--text-faint)]">Why Valbridge</p>
          <h2 className="font-display mt-3 text-[28px] font-semibold leading-tight text-[var(--cream)] sm:text-[32px]">
            Every bottle carries the name of the person who grew it.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--mut)]">
            We work directly with growers and mills so what you taste is a specific harvest rather than a blended average.
          </p>
          <Link href="/shop" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--gold-bright)]">
            Meet the growers <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {focusCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--panel2)] p-7">
              <div className="flex h-10 w-10 items-center justify-center rounded-[0.85rem] bg-[rgba(201,154,86,0.12)] text-[var(--gold-bright)]">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-display mt-4 text-[18px] font-semibold text-[var(--cream)]">{card.title}</h3>
              <p className="mt-2 text-sm leading-7 text-[var(--mut)]">{card.copy}</p>
            </div>
          );
        })}
      </section>

      <div className="mt-8 overflow-hidden rounded-[18px] border border-[var(--line)] bg-[var(--panel2)] py-4">
        <div className="flex w-max animate-[marquee_26s_linear_infinite] gap-14 whitespace-nowrap text-sm text-[var(--text-dim)]">
          {featuredOrigins.concat(featuredOrigins).map((origin, index) => (
            <span key={`${origin}-${index}`} className="flex items-center gap-3 font-[Fraunces] text-[15px]">
              <b className="font-normal text-[var(--gold-bright)]">{origin.split(" · ")[0]}</b>
              <span className="text-[var(--text-dim)]">{origin.split(" · ")[1]}</span>
            </span>
          ))}
        </div>
      </div>

      <section className="mt-12 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--text-faint)]">Shop the edit</p>
            <h2 className="font-display mt-2 text-[32px] font-semibold text-[var(--cream)]">10 lots, this season</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {['All', 'Oils', 'Saffron & Spice', 'Truffle', 'Pantry'].map((filter) => (
              <div key={filter} className={`rounded-full border px-3.5 py-2 text-sm ${filter === 'All' ? 'border-[var(--gold)] bg-[var(--gold)] text-[var(--obsidian)]' : 'border-[var(--line)] text-[var(--mut)]'}`}>
                {filter}
              </div>
            ))}
          </div>
        </div>

        <ProductGrid products={visibleProducts} />

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.25rem] border border-[var(--line)] bg-[var(--panel)] px-4 py-4 sm:px-6">
          <div className="text-sm text-[var(--mut)]">Page {safePage} of {totalPages}</div>
          <div className="flex flex-wrap gap-2">
            {safePage > 1 ? (
              <Link href={safePage === 2 ? "/" : `/?page=${safePage - 1}`} className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-medium text-[var(--cream)] transition hover:border-[var(--gold)] hover:text-[var(--gold-bright)]">
                Previous
              </Link>
            ) : null}
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <Link
                key={pageNumber}
                href={pageNumber === 1 ? "/" : `/?page=${pageNumber}`}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${pageNumber === safePage ? "bg-[var(--gold)] text-[var(--obsidian)]" : "border border-[var(--line)] text-[var(--cream)] hover:border-[var(--gold)] hover:text-[var(--gold-bright)]"}`}
              >
                {pageNumber}
              </Link>
            ))}
            {safePage < totalPages ? (
              <Link href={`/?page=${safePage + 1}`} className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-medium text-[var(--cream)] transition hover:border-[var(--gold)] hover:text-[var(--gold-bright)]">
                Next
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mt-12 overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[radial-gradient(ellipse_90%_140%_at_15%_0%,rgba(224,184,118,0.14),transparent_60%),var(--panel)] p-8 shadow-[0_20px_80px_-40px_rgba(0,0,0,0.75)] sm:p-10 lg:grid lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--text-faint)]">The Valbridge Standard</p>
          <h2 className="font-display mt-3 text-[32px] font-semibold leading-tight text-[var(--cream)]">Composed for the table, not the shelf.</h2>
          <p className="mt-4 max-w-xl text-base leading-8 text-[var(--mut)]">
            From the mill to your door in under two days — every lot is batch-tested, dated, and traceable to a single grower.
          </p>
          <Link href="/shop" className="mt-6 inline-flex items-center justify-center rounded-full bg-[var(--gold)] px-5 py-3 text-sm font-semibold text-[var(--obsidian)] transition hover:bg-[var(--gold-bright)]">
            Explore all lots <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:mt-0">
          {[
            ["Single-origin", "No blends. One grower, one harvest, per bottle."],
            ["Cold-chain shipping", "Temperature-controlled from mill to mailbox."],
            ["Harvest-dated", "Every label states the exact picking window."],
            ["Small-batch", "Lots sell out and stay rare until the next season."],
          ].map(([title, copy]) => (
            <div key={title} className="rounded-[1rem] border border-[var(--line)] bg-[rgba(255,255,255,0.03)] p-5">
              <p className="text-sm font-semibold text-[var(--gold-bright)]">{title}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--mut)]">{copy}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
