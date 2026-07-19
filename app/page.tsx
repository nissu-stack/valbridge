import { HomeBenefitsSection } from "@/components/sections/home-benefits-section";
import { HomeHeroSection } from "@/components/sections/home-hero-section";
import { HomeOriginMarquee } from "@/components/sections/home-origin-marquee";
import { HomeProductShowcase } from "@/components/sections/home-product-showcase";
import { HomeStandardSection } from "@/components/sections/home-standard-section";
import { HOME_FEATURED_ORIGINS } from "@/lib/content/home";
import { shopifyClient } from "@/lib/shopify/client";
import { HOMEPAGE_PRODUCTS_QUERY } from "@/lib/shopify/queries";
import type { Product } from "@/lib/shopify/types";

const siteName = process.env.SITE_NAME ?? "Valbridge";

type HomePageProductsQueryData = {
  products: {
    nodes: Product[];
  };
};

export default async function HomePage() {
  const data = await shopifyClient.request<HomePageProductsQueryData>(HOMEPAGE_PRODUCTS_QUERY, { first: 24 });
  const allProducts = data.products.nodes;
  const heroProduct = allProducts[0];

  return (
    <main id="main-content" className="flex min-h-screen flex-col">
      <HomeHeroSection siteName={siteName} heroProduct={heroProduct} />
      <HomeBenefitsSection />
      <HomeOriginMarquee featuredOrigins={HOME_FEATURED_ORIGINS} />
      <HomeProductShowcase products={allProducts} />
      <HomeStandardSection />
    </main>
  );
}
