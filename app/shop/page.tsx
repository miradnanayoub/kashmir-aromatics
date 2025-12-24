import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image";
import ShopFilters from "@/components/ShopFilters";
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
    // Added pt-28 md:pt-32 to push content below the fixed navbar
    <main className="min-h-screen bg-[#FAFAF9] pt-28 md:pt-32">
      <Navbar />

      {/* Hero section removed completely */}

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
          /* --- YOUR PREFERRED GRID (Saved from memory) --- */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-3 md:gap-x-6 md:gap-y-6">
            {products.map((product: any) => (
              <Link
                key={product.databaseId}
                href={`/product/${product.databaseId}`}
                className="group block"
              >
                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
                  <div className="relative aspect-[4/5] bg-gray-200 overflow-hidden">
                    {product.image?.sourceUrl ? (
                      <Image
                        src={product.image.sourceUrl}
                        alt={product.image.altText || product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                    )}
                  </div>
                  <div className="p-4 text-center flex-grow flex flex-col justify-between">
                    <div>
                      {product.productCategories?.nodes[0] && (
                        <span className="text-[10px] text-amber-600 font-medium uppercase tracking-wider block mb-1">
                          {product.productCategories.nodes[0].name}
                        </span>
                      )}
                      <h3 className="text-base font-serif text-gray-900 group-hover:text-amber-700 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </div>
                    <div className="mt-2 text-sm text-gray-600 font-medium">
                      {product.price || "Check Price"} 
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}