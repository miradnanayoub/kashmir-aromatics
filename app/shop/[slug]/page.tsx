import { client } from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";

// 1. GraphQL Query to get products by Category Slug
const GET_CATEGORY_PRODUCTS = gql`
  query GetCategoryProducts($slug: ID!) {
    productCategory(id: $slug, idType: SLUG) {
      name
      description
      products(first: 50) {
        nodes {
          databaseId
          name
          slug
          ... on SimpleProduct {
            price(format: RAW)
            regularPrice(format: RAW)
          }
          ... on VariableProduct {
            price(format: RAW)
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
  }
`;

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let categoryData = null;
  let products = [];

  try {
    const { data } = await client.query({
      query: GET_CATEGORY_PRODUCTS,
      variables: { slug: slug },
      fetchPolicy: 'no-cache'
    });

    if (data?.productCategory) {
      categoryData = data.productCategory;
      products = data.productCategory.products.nodes.map((node: any) => ({
        // Use databaseId for the unique key to prevent errors
        id: node.databaseId.toString(), 
        databaseId: node.databaseId, 
        title: node.name,
        category: node.productCategories?.nodes[0]?.name,
        price: node.price ? parseFloat(node.price) : 0,
        image: node.image?.sourceUrl || "https://images.unsplash.com/photo-1596434458928-8608e57973c4",
      }));
    }
  } catch (error) {
    console.error("Error fetching category:", error);
  }

  if (!categoryData) {
    return (
      <main className="min-h-screen bg-brand-cream">
        <Navbar />
        <div className="h-[60vh] flex items-center justify-center">
          <h1 className="font-serif text-3xl">Category Not Found</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-cream">
      <Navbar />

      {/* Header Section */}
      <section className="pt-32 pb-12 px-6 text-center">
        <span className="font-sans text-xs font-bold tracking-[0.3em] text-brand-gold uppercase">
          Collection
        </span>
        <h1 className="font-serif text-4xl md:text-5xl text-brand-black mt-4 mb-6">
          {categoryData.name}
        </h1>
        {categoryData.description && (
          <div 
            className="max-w-2xl mx-auto text-gray-500 font-sans leading-relaxed"
            dangerouslySetInnerHTML={{ __html: categoryData.description }}
          />
        )}
      </section>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pb-24">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-8 md:gap-x-8 md:gap-y-12">
            {products.map((product: any) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400">No products found in this category.</p>
          </div>
        )}
      </section>
    </main>
  );
}