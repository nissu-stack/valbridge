import type { Metadata } from "next";
import { EditorialPage } from "@/components/content/editorial-page";

const wholesaleEmail = process.env.WHOLESALE_EMAIL ?? process.env.CONTACT_EMAIL ?? "info@valbridgegroup.com";

export const metadata: Metadata = {
  title: "Wholesale",
  description: "Request Valbridge wholesale availability and pricing for hospitality, retail, and distribution.",
  alternates: { canonical: "/wholesale" },
};

export default function WholesalePage() {
  const inquiryHref = `mailto:${wholesaleEmail}?subject=Wholesale%20price%20list%20request`;

  return (
    <EditorialPage
      eyebrow="B2B · Hospitality · Retail"
      title="A dependable fine-food partner"
      intro="Seasonal availability, considered product selections and responsive service for professional kitchens, hotels, retailers and distributors."
      heroNote="Tailored proposals · International enquiries"
      facts={[
        { label: "For kitchens", value: "Restaurants and hotels" },
        { label: "For commerce", value: "Retail and distribution" },
        { label: "Built around", value: "Market, quantity and season" },
      ]}
      statement={{
        eyebrow: "Professional supply",
        title: "Commercial service with uncompromising attention to product.",
        body: "Wholesale requirements are rarely one-size-fits-all. We shape each proposal around product interest, expected quantity, delivery market and timing—then communicate availability and conditions clearly.",
      }}
      capabilities={{
        eyebrow: "Wholesale range",
        title: "Products and support for your business",
        intro: "From seasonal centrepieces to dependable pantry lines, our team helps build a selection appropriate for your operation and customers.",
        items: [
          { title: "Fresh seasonal products", body: "Fresh-truffle availability and pricing reflect season, grade, origin and current market conditions. Quotes are therefore time-limited." },
          { title: "Pantry selection", body: "Ask about saffron, premium oils, preserved truffle products, gift formats and tailored assortments." },
          { title: "Commercial guidance", body: "We clarify suitable formats, expected quantities and product options for your menu, shelf or distribution model." },
          { title: "Delivery planning", body: "Minimum quantities, temperature requirements, lead times and available delivery services are confirmed for your destination." },
        ],
      }}
      process={{
        eyebrow: "How to begin",
        title: "From enquiry to confirmed supply",
        items: [
          { title: "Share your brief", body: "Tell us your company, market, delivery country, product interests and expected quantities." },
          { title: "Review availability", body: "We assess the current range, seasonality and the most suitable options for your needs." },
          { title: "Receive a proposal", body: "Pricing, minimum quantities, lead times and delivery conditions are presented clearly." },
          { title: "Confirm delivery", body: "Once agreed, we coordinate handling and dispatch around the product and destination." },
        ],
      }}
      closing={{
        eyebrow: "Start a conversation",
        title: "Tell us what your business needs",
        body: "Include your company, destination, preferred products, estimated quantities and required delivery window for a more useful first response.",
        primaryAction: { href: inquiryHref, label: "Request the price list" },
        secondaryAction: { href: "/shop", label: "View the collection" },
      }}
    />
  );
}
