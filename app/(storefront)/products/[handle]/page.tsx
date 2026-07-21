import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight, PackageCheck, ShieldCheck, Sparkles } from "lucide-react";
import sanitizeHtml from "sanitize-html";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductPurchasePanel } from "@/components/product/product-purchase-panel";
import { shopifyClient } from "@/lib/shopify/client";
import { ALL_PRODUCT_HANDLES_QUERY } from "@/lib/shopify/queries";
import type { ProductHandlesQueryData } from "@/lib/shopify/types";
import { formatMoney } from "@/lib/format";
import { absoluteUrl } from "@/lib/config/site";
import { getProductByHandle, getRelatedProducts } from "@/lib/shopify/data";

export const revalidate = 3600;

export async function generateStaticParams() {
  const data = await shopifyClient.request<ProductHandlesQueryData>(ALL_PRODUCT_HANDLES_QUERY, { first: 50 });
  return data.products.nodes.map((node) => ({ handle: node.handle }));
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) return { title: "Produkt nicht gefunden" };

  const description = product.seo?.description ?? sanitizeHtml(product.descriptionHtml ?? "", { allowedTags: [], allowedAttributes: {} }).trim().slice(0, 160);
  const title = product.seo?.title ?? product.title;

  return {
    title,
    description,
    alternates: { canonical: `/products/${product.handle}` },
    openGraph: {
      title,
      description,
      images: product.featuredImage?.url ? [product.featuredImage.url] : [],
      url: `/products/${product.handle}`,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) notFound();

  const plainDescription = sanitizeHtml(product.descriptionHtml ?? "", { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, " ").trim();
  const descriptionExcerpt = plainDescription.length > 250 ? `${plainDescription.slice(0, 247).trimEnd()}…` : plainDescription;
  const safeDescriptionHtml = sanitizeHtml(product.descriptionHtml ?? "", {
    allowedTags: ["p", "br", "strong", "em", "ul", "ol", "li", "h2", "h3", "h4", "blockquote", "a"],
    allowedAttributes: { a: ["href", "title", "target", "rel"] },
    allowedSchemes: ["https", "http", "mailto"],
    transformTags: { a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }) },
  });

  const hasMultiplePrices = product.priceRange.minVariantPrice.amount !== product.priceRange.maxVariantPrice.amount;
  const formattedPrice = hasMultiplePrices
    ? `${formatMoney(product.priceRange.minVariantPrice)} – ${formatMoney(product.priceRange.maxVariantPrice)}`
    : formatMoney(product.priceRange.minVariantPrice);
  const galleryImages = product.images?.nodes?.length ? product.images.nodes : product.featuredImage ? [product.featuredImage] : [];
  const visibleCollections = (product.collections?.nodes ?? []).filter(
    (collection) => !collection.title.toLowerCase().startsWith("hidden:") && !collection.handle.toLowerCase().startsWith("hidden-"),
  );
  const primaryCollection = visibleCollections[0];
  const relatedProducts = await getRelatedProducts(primaryCollection?.handle, product.handle, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: plainDescription,
    image: product.featuredImage?.url ? [product.featuredImage.url] : [],
    offers: {
      "@type": "Offer",
      availability: product.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      price: product.priceRange.minVariantPrice.amount,
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      url: absoluteUrl(`/products/${product.handle}`),
    },
  };

  return (
    <main id="main-content" className="min-h-screen pt-[76px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <nav aria-label="Breadcrumb" className="bg-[var(--obsidian)] px-5 py-5 sm:px-6 lg:px-8">
        <ol className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-2 text-[0.66rem] font-medium uppercase tracking-[0.18em] text-[var(--mut)]">
          <li><Link href="/shop" className="transition hover:text-[var(--gold-light)]">Shop</Link></li>
          {primaryCollection ? (
            <>
              <li><ChevronRight className="h-3.5 w-3.5" aria-hidden="true" /></li>
              <li><Link href={`/shop?category=${primaryCollection.handle}`} className="transition hover:text-[var(--gold-light)]">{primaryCollection.title}</Link></li>
            </>
          ) : null}
          <li><ChevronRight className="h-3.5 w-3.5" aria-hidden="true" /></li>
          <li className="max-w-64 truncate text-[var(--cream-dim)]" aria-current="page">{product.title}</li>
        </ol>
      </nav>

      <section className="bg-[var(--panel)] px-5 py-[clamp(36px,6vw,76px)] sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[minmax(0,1.12fr)_minmax(360px,0.88fr)] lg:gap-[clamp(56px,7vw,96px)]">
          <ProductGallery images={galleryImages} title={product.title} />

          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="flex items-center justify-between gap-4">
              <p className="eyebrow">{primaryCollection?.title ?? "Feinkostauswahl"}</p>
              <p className={`flex shrink-0 items-center gap-2 text-[0.66rem] font-medium uppercase tracking-[0.15em] ${product.availableForSale ? "text-[var(--cream-dim)]" : "text-[var(--mut)]"}`}>
                <span className={`h-1.5 w-1.5 ${product.availableForSale ? "bg-[var(--gold)]" : "bg-[var(--mut)]"}`} aria-hidden="true" />
                {product.availableForSale ? "Auf Lager" : "Nicht verfügbar"}
              </p>
            </div>

            <h1 className="mt-5 font-display text-[clamp(1.85rem,3vw,3rem)] font-bold uppercase leading-[1.15] tracking-[0.055em] text-[var(--gold-pale)]">{product.title}</h1>
            <p className="mt-6 font-display text-[clamp(1.4rem,2.5vw,2rem)] text-[var(--gold-light)]">{formattedPrice}</p>
            {descriptionExcerpt ? <p className="mt-6 font-serif text-[1.16rem] leading-8 text-[var(--mist)]">{descriptionExcerpt}</p> : null}

            <div className="mt-8 border-t border-[var(--line-soft)] pt-8">
              <ProductPurchasePanel variants={product.variants?.nodes ?? []} options={product.options ?? []} />
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 border-t border-[var(--line-soft)] pt-7">
              <div className="flex min-w-0 gap-2">
                <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--gold)]" strokeWidth={1.5} aria-hidden="true" />
                <div className="min-w-0"><p className="text-[0.62rem] font-medium uppercase tracking-[0.08em] text-[var(--cream)] lg:whitespace-nowrap">Kuratierte Qualität</p><p className="mt-1 text-[0.66rem] leading-4 text-[var(--mut)]">Sorgfältig ausgewählt.</p></div>
              </div>
              <div className="flex min-w-0 gap-2">
                <PackageCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--gold)]" strokeWidth={1.5} aria-hidden="true" />
                <div className="min-w-0"><p className="text-[0.62rem] font-medium uppercase tracking-[0.08em] text-[var(--cream)] lg:whitespace-nowrap">Sorgfältige Lieferung</p><p className="mt-1 text-[0.66rem] leading-4 text-[var(--mut)]">Für Frische verpackt.</p></div>
              </div>
              <div className="flex min-w-0 gap-2">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--gold)]" strokeWidth={1.5} aria-hidden="true" />
                <div className="min-w-0"><p className="text-[0.62rem] font-medium uppercase tracking-[0.08em] text-[var(--cream)] lg:whitespace-nowrap">Sicherer Checkout</p><p className="mt-1 text-[0.66rem] leading-4 text-[var(--mut)]">Einfach und geschützt.</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--coal)] px-5 py-[clamp(72px,9vw,120px)] sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1240px] gap-14 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)] lg:gap-24">
          <div>
            <p className="eyebrow">Produktinformationen</p>
            <h2 className="mt-4 font-display text-[clamp(1.8rem,3.5vw,3rem)] uppercase tracking-[0.1em] text-[var(--gold-pale)]">Details und Charakter</h2>
            {safeDescriptionHtml ? (
              <div
                className="mt-8 max-w-3xl font-serif text-[1.12rem] leading-8 text-[var(--mist)] [&_a]:text-[var(--gold-light)] [&_blockquote]:my-6 [&_blockquote]:text-[var(--cream-dim)] [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-[var(--cream)] [&_h3]:mb-3 [&_h3]:mt-7 [&_h3]:font-display [&_h3]:text-xl [&_h3]:text-[var(--cream)] [&_li]:mb-2 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-5 [&_strong]:text-[var(--cream)] [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6"
                dangerouslySetInnerHTML={{ __html: safeDescriptionHtml }}
              />
            ) : (
              <p className="mt-8 max-w-2xl font-serif text-xl leading-8 text-[var(--mist)]">Kontaktieren Sie uns für weitere Informationen zu diesem Produkt, seiner Verfügbarkeit oder geeigneten Anwendungen.</p>
            )}
          </div>

          <aside>
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.26em] text-[var(--gold)]">Der Valbridge-Standard</p>
            <div className="mt-8 space-y-9">
              {[
                ["01", "Sorgfältige Auswahl", "Mit Blick auf Qualität, Herkunft und Eignung ausgewählt."],
                ["02", "Fachgerechte Handhabung", "Entsprechend den Anforderungen des Produkts vorbereitet und verpackt."],
                ["03", "Persönlicher Service", "Klare Beratung zu Produkt, Menge und Lieferung."],
              ].map(([number, title, body]) => (
                <div key={number} className="grid grid-cols-[38px_minmax(0,1fr)] gap-4">
                  <span className="font-display text-lg text-[var(--gold-deep)]" aria-hidden="true">{number}</span>
                  <div><h3 className="font-display text-sm uppercase tracking-[0.1em] text-[var(--cream)]">{title}</h3><p className="mt-2 text-sm leading-6 text-[var(--mut)]">{body}</p></div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      {relatedProducts.length ? (
        <section aria-labelledby="related-products-heading" className="bg-[var(--panel)] px-5 py-[clamp(72px,9vw,120px)] sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1240px]">
            <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow">Weiter entdecken</p>
                <h2 id="related-products-heading" className="mt-4 font-display text-[clamp(1.8rem,3.5vw,3rem)] uppercase tracking-[0.1em] text-[var(--gold-pale)]">Das könnte Ihnen auch gefallen</h2>
                <p className="mt-3 max-w-xl font-serif text-lg text-[var(--mist)]">Aus derselben Kollektion und dem weiteren Valbridge-Sortiment ausgewählt.</p>
              </div>
              <Link href={primaryCollection ? `/shop?category=${primaryCollection.handle}` : "/shop"} className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[var(--gold-light)] transition hover:text-[var(--gold-pale)]">
                Kollektion ansehen <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <ProductGrid products={relatedProducts} />
          </div>
        </section>
      ) : null}

      {visibleCollections.length ? (
        <section className="bg-[var(--obsidian)] px-5 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[1240px] flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.24em] text-[var(--mut)]">Verwandte Kollektionen entdecken</p>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {visibleCollections.map((collection) => (
                <Link key={collection.handle} href={`/shop?category=${collection.handle}`} className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-[var(--gold-light)] transition hover:text-[var(--gold-pale)]">
                  {collection.title} <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
