import { gql } from "graphql-request";

// Consumed by collection grids, search results, and future list views.
export const ProductFragment = gql`
  fragment ProductFragment on Product {
    id
    handle
    title
    descriptionHtml
    availableForSale
    featuredImage {
      url
      altText
      width
      height
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    options {
      name
      values
    }
    variants(first: 100) {
      nodes {
        id
        selectedOptions {
          name
          value
        }
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        availableForSale
        image {
          url
          altText
          width
          height
        }
      }
    }
    collections(first: 5) {
      nodes {
        handle
        title
      }
    }
    seo {
      title
      description
    }
  }
`;

// Consumed by the single product page only.
export const ProductVariantsFragment = gql`
  fragment ProductVariantsFragment on Product {
    variants(first: 100) {
      nodes {
        id
        selectedOptions {
          name
          value
        }
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        availableForSale
        image {
          url
          altText
          width
          height
        }
      }
    }
    options {
      name
      values
    }
  }
`;

// Consumed by the single product page only.
export const ProductImagesFragment = gql`
  fragment ProductImagesFragment on Product {
    images(first: 10) {
      nodes {
        url
        altText
        width
        height
      }
    }
  }
`;

// Consumed by the single product page.
export const PRODUCT_QUERY = gql`
  ${ProductFragment}
  ${ProductVariantsFragment}
  ${ProductImagesFragment}
  query productByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductFragment
      ...ProductVariantsFragment
      ...ProductImagesFragment
      metafields(identifiers: [{ namespace: "custom", key: "material" }, { namespace: "custom", key: "size_chart" }]) {
        key
        namespace
        value
      }
    }
  }
`;

// Consumed by generateStaticParams for the product route and the sitemap.
export const ALL_PRODUCT_HANDLES_QUERY = gql`
  query allProductHandles($first: Int!) {
    products(first: $first) {
      nodes {
        handle
        updatedAt
      }
    }
  }
`;

// Consumed by the collection page with cursor-based pagination and optional sort.
export const COLLECTION_QUERY = gql`
  ${ProductFragment}
  query collectionByHandle($handle: String!, $first: Int, $after: String, $before: String, $last: Int, $sortKey: ProductCollectionSortKeys, $reverse: Boolean) {
    collection(handle: $handle) {
      title
      descriptionHtml
      products(first: $first, after: $after, before: $before, last: $last, sortKey: $sortKey, reverse: $reverse) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          cursor
          node {
            ...ProductFragment
            options {
              name
              values
            }
          }
        }
      }
    }
  }
`;

export const SHOP_PRODUCTS_QUERY = gql`
  ${ProductFragment}
  query shopProducts($first: Int, $after: String, $before: String, $last: Int, $sortKey: ProductSortKeys, $reverse: Boolean) {
    products(first: $first, after: $after, before: $before, last: $last, sortKey: $sortKey, reverse: $reverse) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      nodes {
        ...ProductFragment
      }
    }
  }
`;

// Consumed by the sitemap generator.
export const ALL_COLLECTION_HANDLES_QUERY = gql`
  query allCollectionHandles {
    collections(first: 250) {
      nodes {
        handle
        updatedAt
      }
    }
  }
`;

// Consumed by the shop page to build category filters.
export const ALL_COLLECTIONS_QUERY = gql`
  query allCollections($first: Int!) {
    collections(first: $first) {
      nodes {
        handle
        title
      }
    }
  }
`;

// Consumed by the cart page and cart actions.
export const CART_QUERY = gql`
  query cart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      totalQuantity
      cost {
        subtotalAmount {
          amount
          currencyCode
        }
        totalAmount {
          amount
          currencyCode
        }
        totalTaxAmount {
          amount
          currencyCode
        }
      }
      lines(first: 100) {
        nodes {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              image {
                url
                altText
                width
                height
              }
              price {
                amount
                currencyCode
              }
              product {
                handle
                title
              }
            }
          }
        }
      }
    }
  }
`;

// Consumed by the homepage product grid.
export const HOMEPAGE_PRODUCTS_QUERY = gql`
  ${ProductFragment}
  query homepageProducts($first: Int!) {
    products(first: $first, sortKey: CREATED_AT, reverse: true) {
      nodes {
        ...ProductFragment
      }
    }
  }
`;

// Consumed by the search page and future search providers.
export const SEARCH_QUERY = gql`
  ${ProductFragment}
  query searchProducts($query: String!) {
    search(query: $query, first: 20, types: PRODUCT) {
      nodes {
        ... on Product {
          ...ProductFragment
        }
      }
    }
  }
`;
