import { client } from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import Navbar from "@/components/Navbar";
import ProductView from "@/components/ProductView";

// 1. The Fixed GraphQL Query
const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id, idType: DATABASE_ID) {
      databaseId
      name
      description
      shortDescription
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
      # We move stockStatus inside the specific product types
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

// 2. The Page Component
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  let product: any = null;

  try {
    const { data } = await client.query<any>({
      query: GET_PRODUCT,
      variables: { id: id },
      fetchPolicy: 'no-cache'
    });

    if (data?.product) {
      const p = data.product;
      
      // Combine main image + gallery images
      const allImages = [
        p.image?.sourceUrl,
        ...(p.galleryImages?.nodes.map((n: any) => n.sourceUrl) || [])
      ].filter(Boolean);

      product = {
        id: p.databaseId.toString(),
        databaseId: p.databaseId,    // <--- CRITICAL: Make sure this line exists
        title: p.name,
        // Handle price (it might come from Simple or Variable product)
        price: p.price ? parseFloat(p.price) : 0,
        description: p.description || p.shortDescription || "",
        category: p.productCategories?.nodes[0]?.name || "Kashmir Aromatics",
        images: allImages.length > 0 ? allImages : ["https://images.unsplash.com/photo-1596434458928-8608e57973c4"],
        // Handle stockStatus (default to IN_STOCK if missing)
        stockStatus: p.stockStatus || 'IN_STOCK'
      };
    }
  } catch (error: any) {
    console.error("--- GRAPHQL ERROR ---");
    console.error(error.message);
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-brand-cream">
        <Navbar />
        <div className="h-screen flex flex-col items-center justify-center gap-4">
          <h1 className="font-serif text-2xl text-brand-black">Product Not Found</h1>
          <p className="text-sm text-gray-500">Checked ID: {id}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-cream">
      <Navbar />
      <ProductView product={product} />
    </main>
  );
}