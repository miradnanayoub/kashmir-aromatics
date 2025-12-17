import ProductCard from "./ProductCard";
import { client } from "@/lib/apolloClient"; // Import our new client
import { gql } from "@apollo/client";

// 1. The GraphQL Query
const GET_FEATURED_PRODUCTS = gql`
  query GetFeaturedProducts {
    products(first: 4) {
      nodes {
        id
        databaseId
        name
        slug
        ... on SimpleProduct {
          price(format: RAW)
          regularPrice(format: RAW)
        }
        image {
          sourceUrl
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

// 2. The Component (Now Async!)
export default async function FeaturedCollection() {
  let products: any[] = [];
  
  try {
    // Fetch data from WordPress
    const { data } = await client.query<any>({
      query: GET_FEATURED_PRODUCTS,
    });
    
    // Transform WordPress data to match our ProductCard format
    products = data?.products?.nodes.map((node: any) => ({
      id: node.databaseId.toString(), // We use databaseId for cleaner IDs
      title: node.name,
      category: node.productCategories?.nodes[0]?.name || "Kashmir Aromatics",
      price: node.price ? parseFloat(node.price) : 0, // Handle missing prices
      image: node.image?.sourceUrl || "https://images.unsplash.com/photo-1596434458928-8608e57973c4", // Fallback image
    })) || [];

  } catch (error) {
    console.error("Failed to fetch products:", error);
    // You could return a fallback UI here if needed
  }

  if (products.length === 0) {
    return (
      <section className="py-24 bg-brand-cream text-center">
        <p>Loading products from Kashmir Aromatics...</p>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-brand-cream relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(#1A1A1A 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-16">
          <span className="font-sans text-[10px] md:text-xs font-bold tracking-[0.3em] text-brand-gold uppercase">
            Curated For You
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-brand-black mt-2 md:mt-3">
            Best of the Valley
          </h2>
          <div className="w-16 md:w-24 h-[1px] bg-brand-black/20 mx-auto mt-4 md:mt-6"></div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-8 md:gap-x-8 md:gap-y-12">
          {products.map((product: any) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}