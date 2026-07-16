export type Money = {
  amount: string;
  currencyCode: string;
};

export type Image = {
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

export type ProductSeo = {
  title?: string | null;
  description?: string | null;
};

export type ProductPriceRange = {
  minVariantPrice: Money;
  maxVariantPrice: Money;
};

export type ProductVariant = {
  id: string;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
  price: Money;
  compareAtPrice?: Money | null;
  availableForSale: boolean;
  image?: Image | null;
};

export type ProductOption = {
  name: string;
  values: string[];
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  descriptionHtml?: string | null;
  availableForSale: boolean;
  featuredImage?: Image | null;
  priceRange: ProductPriceRange;
  seo?: ProductSeo | null;
  variants?: {
    nodes: ProductVariant[];
  } | null;
  options?: ProductOption[] | null;
  images?: {
    nodes: Image[];
  } | null;
  collections?: {
    nodes: Array<{
      handle: string;
      title: string;
    }>;
  } | null;
  metafields?: Array<{
    key: string;
    namespace: string;
    value: string;
  }> | null;
};

export type ProductQueryData = {
  product: Product | null;
};

export type CollectionQueryData = {
  collection: {
    title: string;
    descriptionHtml?: string | null;
    products: {
      pageInfo: {
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        startCursor?: string | null;
        endCursor?: string | null;
      };
      edges: Array<{
        cursor: string;
        node: Product;
      }>;
    };
  } | null;
};

export type ProductHandlesQueryData = {
  products: {
    nodes: Array<{ handle: string }>;
  };
};

export type CartLineMerchandise = {
  id: string;
  title: string;
  image?: Image | null;
  price: Money;
  product: {
    handle: string;
    title: string;
  };
};

export type CartLine = {
  id: string;
  quantity: number;
  merchandise: CartLineMerchandise;
};

export type CartCost = {
  subtotalAmount: Money;
  totalAmount: Money;
  totalTaxAmount: Money;
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: CartCost;
  lines: {
    nodes: CartLine[];
  };
};

export type CartQueryData = {
  cart: Cart | null;
};
