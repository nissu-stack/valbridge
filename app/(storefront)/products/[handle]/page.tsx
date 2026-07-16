import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductPurchasePanel } from "@/components/product/product-purchase-panel";
import { Badge } from "@/components/ui/badge";
import { shopifyClient } from "@/lib/shopify/client";
import { ALL_PRODUCT_HANDLES_QUERY, PRODUCT_QUERY } from "@/lib/shopify/queries";
import type { ProductHandlesQueryData, ProductQueryData } from "@/lib/shopify/types";

export const revalidate = 3600;

export async function generateStaticParams() {
  const data = await shopifyClient.request<ProductHandlesQueryData>(ALL_PRODUCT_HANDLES_QUERY, {
    first: 50,
  });

  return data.products.nodes.map((node) => ({ handle: node.handle }));
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  const data = await shopifyClient.request<ProductQueryData>(PRODUCT_QUERY, { handle });
  const product = data.product;

  if (!product) {
    return {
      title: "Product not found",
    };
  }

  const description = product.seo?.description ?? product.descriptionHtml?.replace(/<[^>]+>/g, "").trim().slice(0, 160) ?? "";
  const title = product.seo?.title ?? product.title;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.featuredImage?.url ? [product.featuredImage.url] : [],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const data = await shopifyClient.request<ProductQueryData>(PRODUCT_QUERY, { handle });
  const product = data.product;

  if (!product) {
    notFound();
  }

  const primaryPrice = product.priceRange.minVariantPrice.amount;
  const priceLabel = `${product.priceRange.minVariantPrice.amount} ${product.priceRange.minVariantPrice.currencyCode}`;
  const hasMultiplePrices = product.priceRange.minVariantPrice.amount !== product.priceRange.maxVariantPrice.amount;
  const formattedPrice = hasMultiplePrices
    ? `${product.priceRange.minVariantPrice.amount} - ${product.priceRange.maxVariantPrice.amount} ${product.priceRange.maxVariantPrice.currencyCode}`
    : priceLabel;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.descriptionHtml?.replace(/<[^>]+>/g, "").trim() ?? "",
    image: product.featuredImage?.url ? [product.featuredImage.url] : [],
    offers: {
      "@type": "Offer",
      availability: product.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      price: primaryPrice,
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      url: `https://${process.env.SHOPIFY_STORE_DOMAIN}/products/${product.handle}`,
    },
  };

  const galleryImages = product.images?.nodes?.length ? product.images.nodes : product.featuredImage ? [product.featuredImage] : [];
  const hasCompareAtPrice = Boolean(product.variants?.nodes?.some((variant) => variant.compareAtPrice));
  const compareAtPrice = product.variants?.nodes?.find((variant) => variant.compareAtPrice)?.compareAtPrice;

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-10 px-4 pt-16 pb-10 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr] lg:gap-14">
        <div className="space-y-6">
          <ProductGallery images={galleryImages} title={product.title} />
        </div>

        <div className="space-y-8 lg:sticky lg:top-10 lg:self-start">
          <div className="rounded-[2rem] border border-[var(--line)] bg-[var(--panel)] p-8 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.55)]">
            <div className="space-y-5">
              <Badge className="border-[var(--gold)] bg-[rgba(201,150,43,0.12)] text-[var(--gold-light)]">Maison Valbridge</Badge>
              <div className="space-y-4">
                <h1 className="text-3xl font-semibold tracking-tight text-[var(--cream)] sm:text-4xl">
                  {product.title}
                </h1>
                <p className="max-w-2xl text-sm uppercase tracking-[0.28em] text-[var(--gold-light)]">A refined selection from our curated gourmet edit.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-4xl font-semibold tracking-tight text-[var(--cream)]">{formattedPrice}</p>
                {hasCompareAtPrice && compareAtPrice ? (
                  <span className="text-sm uppercase tracking-[0.22em] text-[var(--mut)] line-through">{compareAtPrice.amount} {compareAtPrice.currencyCode}</span>
                ) : null}
              </div>
              <p className="text-sm leading-7 text-[var(--mist)]">
                Experience premium ingredients sourced from Europe’s most celebrated terroirs. Crafted for table service and fine gift-giving.
              </p>
            </div>

            <div className="mt-8">
              <ProductPurchasePanel variants={product.variants?.nodes ?? []} options={product.options ?? []} />
            </div>
          </div>
        </div>
      </div>

      <section className="rounded-[2rem] border border-[var(--line)] bg-[var(--panel)] p-8 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.55)] sm:p-10">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--cream)]">Product details</h2>
            <div className="mt-5 prose prose-sm max-w-none text-[var(--mist)]" dangerouslySetInnerHTML={{ __html: product.descriptionHtml ?? "" }} />
          </div>
          <div className="space-y-6 rounded-[1.75rem] border border-[var(--gold)] bg-[rgba(201,150,43,0.06)] p-6">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--gold-light)]">Highlights</p>
              <ul className="mt-4 space-y-3 text-sm text-[var(--cream)]">
                <li className="leading-6">Premium ingredients selected for depth and balance.</li>
                <li className="leading-6">Ideal for gourmet kitchens, restaurants, and luxury gifting.</li>
                <li className="leading-6">Crafted with provenance, purity, and sustainable sourcing.</li>
              </ul>
            </div>
            {product.collections?.nodes?.length ? (
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-[var(--gold-light)]">Collections</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.collections.nodes.map((collection) => (
                    <span key={collection.handle} className="rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.05)] px-3 py-2 text-[0.75rem] uppercase tracking-[0.18em] text-[var(--gold-light)]">
                      {collection.title}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <div className="sticky bottom-0 z-20 border-t border-zinc-200 bg-white/95 px-4 py-3 backdrop-blur sm:hidden">
        <ProductPurchasePanel variants={product.variants?.nodes ?? []} options={product.options ?? []} compact />
      </div>
    </main>
  );
}
