import Navbar from "@/components/Navbar";
import Link from "next/link";
import ShopFilters from "@/components/ShopFilters";
import ProductCard from "@/components/ProductCard"; // <--- NEW IMPORT
import { client } from "@/lib/apolloClient";
import { GET_ALL_PRODUCTS, GET_PRODUCTS_BY_CATEGORY, GET_CATEGORIES } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  
  const categoryId = resolvedParams.category ? Number(resolvedParams.category) : null;
  const sortOption = (resolvedParams.sort as string) || "date";

  let orderByClause = [{ field: "DATE", order: "DESC" }]; 

  if (sortOption === "price_asc") {
    orderByClause = [{ field: "PRICE", order: "ASC" }];
  } else if (sortOption === "price_desc") {
    orderByClause = [{ field: "PRICE", order: "DESC" }];
  } else if (sortOption === "title") {
    orderByClause = [{ field: "TITLE", order: "ASC" }];
  }

  let products: any[] = [];
  let categories: any[] = [];

  try {
    const productQuery = categoryId ? GET_PRODUCTS_BY_CATEGORY : GET_ALL_PRODUCTS;
    const productVariables = categoryId 
      ? { categoryId, orderBy: orderByClause } 
      : { orderBy: orderByClause };

    const [productsRes, categoriesRes] = await Promise.all([
      client.query<any>({
        query: productQuery,
        variables: productVariables,
        fetchPolicy: "no-cache",
      }),
      client.query<any>({
        query: GET_CATEGORIES,
      }),
    ]);

    products = productsRes.data?.products?.nodes || [];
    categories = categoriesRes.data?.productCategories?.nodes.map((cat: any) => ({
      id: cat.databaseId,
      name: cat.name,
      slug: cat.slug,
    })) || [];

  } catch (error) {
    console.error("GraphQL Error:", error);
  }

  return (
    <main className="min-h-screen bg-[#FAFAF9] pt-28 md:pt-32">
      
      <div className="max-w-[1400px] mx-auto px-6 pb-24">
        <ShopFilters categories={categories} />

        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p>No products found.</p>
            <Link href="/shop" className="text-amber-600 hover:underline mt-2 inline-block">
              Clear filters
            </Link>
          </div>
        ) : (
          /* --- UPDATED GRID WITH NEW CARD COMPONENT --- */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-3 md:gap-x-4 md:gap-y-4">
            {products.map((product: any) => (
              <ProductCard key={product.databaseId} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}