import { client } from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import Navbar from "@/components/Navbar";
import ProductView from "@/components/ProductView";

export const dynamic = "force-dynamic";

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

      // Clean Price Logic (Remove non-digits, ensure it's a number)
      const rawPrice = p.price ? parseFloat(p.price.replace(/[^\d.]/g, "")) : 0;

      product = {
        id: p.databaseId.toString(),
        databaseId: p.databaseId,    // Critical for Checkout
        title: p.name,
        price: rawPrice,
        description: p.description || p.shortDescription || "",
        category: p.productCategories?.nodes[0]?.name || "Kashmir Aromatics",
        images: allImages.length > 0 ? allImages : ["/placeholder.jpg"], // Ensure a fallback exists
        stockStatus: p.stockStatus || 'IN_STOCK'
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

  return (
    <main className="min-h-screen bg-[#FAFAF9]">
      <Navbar />
      {/* Passing the prepared data to the Client Component */}
      <ProductView product={product} />
    </main>
  );
}