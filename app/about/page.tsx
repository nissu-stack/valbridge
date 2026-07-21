import type { Metadata } from "next";
import { EditorialPage } from "@/components/content/editorial-page";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Valbridge Group's Swiss-led sourcing and international fine-food network.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <EditorialPage
      eyebrow="Valbridge Group · Canton of Bern"
      title="A bridge from origin to table"
      intro="We connect distinguished producers with chefs, retailers and private clients who value provenance, consistency and exceptional flavour."
      heroNote="Swiss-led sourcing · International service"
      facts={[
        { label: "Our base", value: "Canton of Bern, Switzerland" },
        { label: "Our focus", value: "Truffles, saffron and fine foods" },
        { label: "Our clients", value: "Hospitality, retail and private" },
      ]}
      statement={{
        eyebrow: "Our perspective",
        title: "Fine food is built on relationships, not shortcuts.",
        body: "We look beyond the product itself—to the people, places and decisions that shape it. That means thoughtful sourcing, honest communication and careful handling from the first conversation through final delivery.",
      }}
      capabilities={{
        eyebrow: "How we work",
        title: "Considered at every step",
        intro: "A focused way of working that protects quality while making exceptional ingredients easier to source.",
        items: [
          { title: "Origin relationships", body: "We work with specialist producers and regional partners across Europe and selected origin markets, prioritising provenance and dependable quality." },
          { title: "Disciplined selection", body: "Products are considered for flavour, condition and suitability before they become part of the Valbridge range." },
          { title: "Careful logistics", body: "Premium and perishable goods are handled with the timing, packaging and delivery attention their character requires." },
          { title: "Personal service", body: "We tailor guidance to the client, market, season and occasion—whether for a professional kitchen, retail shelf or private table." },
        ],
      }}
      process={{
        eyebrow: "From source to service",
        title: "A clear path to exceptional ingredients",
        items: [
          { title: "Discover", body: "Identify producers, regions and products with a distinctive story and credible provenance." },
          { title: "Select", body: "Assess quality, seasonality and fit with the standards expected by our clients." },
          { title: "Coordinate", body: "Plan quantities, handling and delivery around the needs of each order." },
          { title: "Support", body: "Stay available with practical guidance before, during and after delivery." },
        ],
      }}
      closing={{
        eyebrow: "Work with Valbridge",
        title: "Bring considered ingredients to your table",
        body: "Explore the collection or speak with us about sourcing for hospitality, retail and distribution.",
        primaryAction: { href: "/shop", label: "Explore the collection" },
        secondaryAction: { href: "/wholesale", label: "Wholesale inquiries" },
      }}
    />
  );
}
