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
    <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
        <div className="space-y-4">
          <ProductGallery images={galleryImages} title={product.title} />
        </div>

        <div className="space-y-6 lg:sticky lg:top-8 lg:self-start">
          <div className="space-y-3">
            <Badge className="bg-zinc-100 text-zinc-700">Maison Valbridge</Badge>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">{product.title}</h1>
            <div className="flex items-center gap-3">
              <p className="text-2xl font-semibold text-zinc-950">{formattedPrice}</p>
              {hasCompareAtPrice && compareAtPrice ? (
                <span className="text-lg text-zinc-400 line-through">{compareAtPrice.amount} {compareAtPrice.currencyCode}</span>
              ) : null}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
            <ProductPurchasePanel variants={product.variants?.nodes ?? []} options={product.options ?? []} />
          </div>

          <div className="rounded-[1.75rem] border border-zinc-200 bg-zinc-50 p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-zinc-950">Description</h2>
            {/* Trusted Shopify Admin HTML content. */}
            <div className="prose prose-sm mt-3 max-w-none text-zinc-700" dangerouslySetInnerHTML={{ __html: product.descriptionHtml ?? "" }} />
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 z-20 border-t border-zinc-200 bg-white/95 px-4 py-3 backdrop-blur sm:hidden">
        <ProductPurchasePanel variants={product.variants?.nodes ?? []} options={product.options ?? []} compact />
      </div>
    </main>
  );
}
