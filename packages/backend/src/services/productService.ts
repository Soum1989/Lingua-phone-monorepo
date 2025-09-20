// backend/src/services/productService.ts
import { products } from "../data/productsData";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  url: string;
}

/**
 * Fetch products by keyword or category.
 * - If query matches a category, return all products in that category.
 * - Otherwise search product names + categories.
 */
export function fetchProducts(query: string): Product[] {
  if (!query) return [];

  const q = query.toLowerCase().trim();

  // Check if query directly matches a category
  const exactCategoryMatches = products.filter((p) =>
    p.category.toLowerCase() === q
  );
  if (exactCategoryMatches.length > 0) {
    return exactCategoryMatches;
  }

  // Otherwise, do keyword-based matching in name + category
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  );
}

/**
 * Recommend similar products by category.
 * Returns up to 3 alternatives excluding the given product.
 */
export function getProductRecommendations(productId: string): Product[] {
  const product = products.find((p) => p.id === productId);
  if (!product) return [];

  return products
    .filter((p) => p.category === product.category && p.id !== productId)
    .slice(0, 3);
}
