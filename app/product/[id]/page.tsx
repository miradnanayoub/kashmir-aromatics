import { client } from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import Navbar from "@/components/Navbar";
import ProductView from "@/components/ProductView";
import ReviewForm from "@/components/ReviewForm";
import { Star, User } from "lucide-react";

export const dynamic = "force-dynamic";

// 1. QUERY (Removed 'rating' from reviews to prevent crash, but kept averageRating)
const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id, idType: DATABASE_ID) {
      databaseId
      name
      description
      shortDescription
      averageRating
      reviewCount
      image {
        sourceUrl
      }
      galleryImages {
        nodes {
          sourceUrl
        }
      }
      productCategories {
        nodes {
          name
        }
      }
      reviews(first: 20) {
        nodes {
          id
          date
          content
          # rating <--- Removed to prevent "Cannot query field" error
          author {
            node {
              name
              avatar {
                url
              }
            }
          }
        }
      }
      ... on SimpleProduct {
        price(format: RAW)
        stockStatus
      }
      ... on VariableProduct {
        price(format: RAW)
        stockStatus
      }
    }
  }
`;

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  let product: any = null;
  let reviews: any[] = [];

  try {
    const { data } = await client.query<any>({
      query: GET_PRODUCT,
      variables: { id: id },
      fetchPolicy: 'no-cache'
    });

    if (data?.product) {
      const p = data.product;
      
      const allImages = [
        p.image?.sourceUrl,
        ...(p.galleryImages?.nodes.map((n: any) => n.sourceUrl) || [])
      ].filter(Boolean);

      const rawPrice = p.price ? parseFloat(p.price.replace(/[^\d.]/g, "")) : 0;

      reviews = p.reviews?.nodes.map((r: any) => ({
        id: r.id,
        author: r.author?.node?.name || "Anonymous",
        avatar: r.author?.node?.avatar?.url || "",
        rating: 5, // Default for individual reviews until plugin update
        date: new Date(r.date).toLocaleDateString("en-IN", { 
          year: 'numeric', month: 'long', day: 'numeric' 
        }),
        content: r.content 
      })) || [];

      product = {
        id: p.databaseId.toString(),
        databaseId: p.databaseId,    
        title: p.name,
        price: rawPrice,
        description: p.description || p.shortDescription || "",
        category: p.productCategories?.nodes[0]?.name || "Kashmir Aromatics",
        images: allImages.length > 0 ? allImages : ["/placeholder.jpg"], 
        stockStatus: p.stockStatus || 'IN_STOCK',
        averageRating: p.averageRating,
        reviewCount: p.reviewCount,
      };
    }
  } catch (error: any) {
    console.error("--- GRAPHQL ERROR ---", error.message);
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-[#FAFAF9]">
        <Navbar />
        <div className="h-screen flex flex-col items-center justify-center gap-4">
          <h1 className="font-serif text-3xl text-gray-900">Product Not Found</h1>
          <p className="text-sm text-gray-500 font-sans">We couldn't locate the item you requested.</p>
        </div>
      </main>
    );
  }

  // Calculate stats for the Summary Section
  const averageRating = parseFloat(product.averageRating) || 0;
  const reviewCount = product.reviewCount || 0;

  return (
    <main className="min-h-screen bg-[#FAFAF9]">
      <Navbar />
      
      {/* Product View (Ensure you update ProductView.tsx with the snippet above!) */}
      <ProductView product={product} />

      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 border-t border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Reviews List Column */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* --- REVIEWS HEADER WITH STARS --- */}
            <div className="flex flex-col gap-2">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">
                Customer Reviews
              </h2>
              
              {reviewCount > 0 ? (
                <div className="flex items-center gap-3">
                  <div className="flex text-brand-gold">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={18} 
                        className={i < Math.round(averageRating) ? "fill-current text-brand-gold" : "text-gray-200"}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 font-medium">
                    {averageRating.toFixed(1)} out of 5 based on {reviewCount} reviews
                  </span>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No reviews yet.</p>
              )}
            </div>

            {/* List of Reviews */}
            {reviews.length > 0 ? (
              <div className="space-y-8 mt-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-8 last:border-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                          {review.avatar ? (
                            <img src={review.avatar} alt={review.author} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{review.author}</p>
                          <p className="text-xs text-gray-400">{review.date}</p>
                        </div>
                      </div>
                      {/* Individual Review Stars (Currently defaulted to 5) */}
                      <div className="flex text-brand-gold">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={14} 
                            className={i < review.rating ? "fill-current text-brand-gold" : "text-gray-200"}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div 
                      className="text-gray-600 text-sm leading-relaxed prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: review.content }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center mt-6">
                <p className="text-gray-500 italic">No reviews yet. Be the first to share your experience!</p>
              </div>
            )}
          </div>

          {/* Form Column */}
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <ReviewForm productId={product.databaseId} />
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}