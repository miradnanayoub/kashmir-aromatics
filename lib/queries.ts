import { gql } from "@apollo/client";

// 1. Fetch Categories (for filters)
export const GET_CATEGORIES = gql`
  query GetCategories {
    productCategories(where: { hideEmpty: true }) {
      nodes {
        databaseId
        name
        slug
      }
    }
  }
`;

// 2. Fetch ALL Products
export const GET_ALL_PRODUCTS = gql`
  query GetAllProducts($orderBy: [ProductsOrderbyInput]) {
    products(first: 50, where: { orderby: $orderBy }) {
      nodes {
        databaseId
        name
        slug
        image {
          sourceUrl
          altText
        }
        ... on SimpleProduct {
          price
          regularPrice
          stockStatus
        }
        ... on VariableProduct {
          price
          regularPrice
          stockStatus
        }
        productCategories {
          nodes {
            name
          }
        }
      }
    }
  }
`;

// 3. Fetch Products by Category ID (Internal use)
export const GET_PRODUCTS_BY_CATEGORY = gql`
  query GetCategoryProducts($categoryId: Int, $orderBy: [ProductsOrderbyInput]) {
    products(
      first: 50, 
      where: { 
        categoryId: $categoryId, 
        orderby: $orderBy 
      }
    ) {
      nodes {
        databaseId
        name
        slug
        image {
          sourceUrl
          altText
        }
        ... on SimpleProduct {
          price
          regularPrice
          stockStatus
        }
        ... on VariableProduct {
          price
          regularPrice
          stockStatus
        }
        productCategories {
          nodes {
            name
          }
        }
      }
    }
  }
`;

// 4. (NEW) Fetch Category + Products by SLUG (For URL navigation)
export const GET_CATEGORY_BY_SLUG = gql`
  query GetCategoryBySlug($slug: ID!) {
    productCategory(id: $slug, idType: SLUG) {
      name
      description
      products(first: 50) {
        nodes {
          databaseId
          name
          slug
          image {
            sourceUrl
            altText
          }
          ... on SimpleProduct {
            price
            regularPrice
          }
          ... on VariableProduct {
            price
            regularPrice
          }
          productCategories {
            nodes {
              name
            }
          }
        }
      }
    }
  }
`;