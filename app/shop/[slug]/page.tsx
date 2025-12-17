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

  // --- 404 View (If slug is wrong) ---
  if (!categoryData) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
          <h1 className="font-serif text-3xl text-gray-900">Category Not Found</h1>
          <p className="text-gray-500">We couldn't find a category for "{slug}"</p>
          <Link href="/shop" className="text-amber-600 hover:underline">
            Return to Shop
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      {/* --- HEADER --- */}
      <section className="bg-white pt-32 pb-12 px-6 border-b border-gray-100 text-center">
        <span className="font-sans text-xs font-bold tracking-[0.3em] text-amber-600 uppercase">
          Collection
        </span>
        <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mt-4 mb-6">
          {categoryData.name}
        </h1>
        {categoryData.description && (
          <div 
            className="max-w-2xl mx-auto text-gray-500 font-sans leading-relaxed"
            dangerouslySetInnerHTML={{ __html: categoryData.description }}
          />
        )}
      </section>

      {/* --- PRODUCT GRID --- */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
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
                  <div className="p-5 text-center flex-grow flex flex-col justify-between">
                    <div>
                      <span className="text-xs text-amber-600 font-medium uppercase tracking-wider block mb-1">
                        {categoryData.name}
                      </span>
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