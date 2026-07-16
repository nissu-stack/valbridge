import type { LucideIcon } from "lucide-react";
import { Leaf, ShieldCheck } from "lucide-react";

export type HomeFocusCard = {
  icon: LucideIcon;
  title: string;
  copy: string;
};

export const HOME_TRUST_ITEMS = [
  { label: "Active lots", value: "10" },
  { label: "Origin countries", value: "4" },
  { label: "Cold-chain dispatch", value: "48h" },
];

export const HOME_FOCUS_CARDS: HomeFocusCard[] = [
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

export const HOME_FEATURED_ORIGINS = [
  "Picual olives · Jaén, Spain",
  "Saffron threads · Khorasan, Iran",
  "Hojiblanca olives · Córdoba, Spain",
  "Summer truffle · Umbria, Italy",
];

export type HomeProductFilter = {
  label: string;
  collectionHandles: string[];
};

export const HOME_PRODUCT_FILTERS: HomeProductFilter[] = [
  { label: "All", collectionHandles: [] },
  { label: "Oils", collectionHandles: ["premium-olive-oil", "olive-oil", "oils"] },
  { label: "Saffron & Spice", collectionHandles: ["safran", "saffron", "spice"] },
  { label: "Truffle", collectionHandles: ["truffelprodukte", "truffle-products", "fresh-truffles"] },
  { label: "Pantry", collectionHandles: ["pantry", "fine-foods", "pantry-goods"] },
];
