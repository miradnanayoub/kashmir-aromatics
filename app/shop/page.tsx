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
    <main className="min-h-screen bg-[#FAFAF9]">
      <Navbar />

      {/* --- HERO SECTION (New) --- */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center mb-12">
        <div className="absolute inset-0">
          <Image 
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2600&auto=format&fit=crop" 
          alt="Kashmir Aromatics Shop" 
          fill 
          className="object-cover"
          priority
          />
          {/* Dark Overlay so white text is readable */}
          <div className="absolute inset-0 bg-black/40" /> 
        </div>
        
        <div className="relative z-10 text-center px-6">
          <span className="text-amber-400 font-bold tracking-[0.2em] text-xs uppercase mb-3 block">
            Our Collection
          </span>
          <h1 className="text-5xl md:text-6xl font-serif text-white mb-6">
            Treasures of the Valley
          </h1>
          <p className="text-gray-100 max-w-2xl mx-auto font-sans text-lg font-light leading-relaxed">
            Handpicked botanicals, distilled with tradition. Explore our complete range of authentic Kashmiri wellness products.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-24">
        <ShopFilters categories={categories} />

        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p>No products found.</p>
            <Link href="/shop" className="text-amber-600 hover:underline mt-2 inline-block">
              Clear filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
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
                  <div className="p-5 text-center flex-grow flex flex-col justify-between">
                    <div>
                      {product.productCategories?.nodes[0] && (
                        <span className="text-xs text-amber-600 font-medium uppercase tracking-wider block mb-1">
                          {product.productCategories.nodes[0].name}
                        </span>
                      )}
                      <h3 className="text-lg font-serif text-gray-900 group-hover:text-amber-700 transition-colors">
                        {product.name}
                      </h3>
                    </div>
                    <div className="mt-3 text-gray-600 font-medium">
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