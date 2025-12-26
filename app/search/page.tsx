import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image";
import { client } from "@/lib/apolloClient";
import { GET_SEARCH_RESULTS } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const query = (resolvedParams.q as string) || "";

  let products: any[] = [];

  if (query) {
    try {
      const { data } = await client.query<any>({
        query: GET_SEARCH_RESULTS,
        variables: { search: query },
        fetchPolicy: "no-cache",
      });
      products = data?.products?.nodes || [];
    } catch (error) {
      console.error("Search Error:", error);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      
      <div className="bg-white pt-32 pb-8 px-6 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-serif text-gray-900">
            {query ? `Search results for "${query}"` : "Search our collection"}
          </h1>
          <p className="text-gray-500 mt-2">
            {products.length} {products.length === 1 ? "result" : "results"} found
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-gray-100 shadow-sm">
            <h3 className="text-xl font-serif text-gray-900 mb-2">No matches found</h3>
            <p className="text-gray-500 mb-6">Try checking your spelling or using a different keyword.</p>
            <Link href="/shop" className="text-amber-600 font-medium hover:underline">
              Browse All Products &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
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
                      <div className="flex items-center justify-center h-full text-gray-400 bg-gray-100">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-serif text-gray-900 group-hover:text-amber-700 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
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