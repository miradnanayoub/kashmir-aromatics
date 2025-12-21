import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image";
import { client } from "@/lib/apolloClient";
import { GET_CATEGORY_BY_SLUG } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;

  let categoryData: any = null;
  let products: any[] = [];

  try {
    const { data } = await client.query<any>({
      query: GET_CATEGORY_BY_SLUG,
      variables: { slug: slug },
      fetchPolicy: 'no-cache'
    });

    if (data?.productCategory) {
      categoryData = data.productCategory;
      products = data.productCategory.products.nodes || [];
    }
  } catch (error) {
    console.error("Error fetching category:", error);
  }

  // --- 404 View ---
  if (!categoryData) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
          <h1 className="font-serif text-3xl text-gray-900">Category Not Found</h1>
          <Link href="/shop" className="text-amber-600 hover:underline">Return to Shop</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAF9]">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative h-[40vh] min-h-[350px] flex items-center justify-center mb-12">
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2600&auto=format&fit=crop" 
            alt={categoryData.name}
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center px-6">
          <span className="text-amber-400 font-bold tracking-[0.2em] text-xs uppercase mb-3 block">
            Category
          </span>
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-4">
            {categoryData.name}
          </h1>
          {categoryData.description && (
            <div 
              className="max-w-2xl mx-auto text-gray-100 font-sans text-lg font-light leading-relaxed"
              dangerouslySetInnerHTML={{ __html: categoryData.description }}
            />
          )}
        </div>
      </section>

      {/* --- PRODUCT GRID --- */}
      <section className="max-w-[1400px] mx-auto px-6 pb-24">
        {products.length > 0 ? (
          /* --- UPDATED GRID LAYOUT --- */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {products.map((product: any) => (
              <Link
                key={product.databaseId}
                href={`/product/${product.databaseId}`}
                className="group block"
              >
                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
                  
                  {/* Image */}
                  <div className="relative aspect-[4/5] bg-gray-200 overflow-hidden">
                    {product.image?.sourceUrl ? (
                      <Image
                        src={product.image.sourceUrl}
                        alt={product.image.altText || product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4 text-center flex-grow flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-amber-600 font-medium uppercase tracking-wider block mb-1">
                        {categoryData.name}
                      </span>
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
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400">No products found in this category.</p>
            <Link href="/shop" className="text-amber-600 hover:underline mt-4 inline-block">
              Browse All Products
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}