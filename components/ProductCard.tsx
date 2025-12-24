"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }: { product: any }) {
  const { addItem, toggleCart } = useCart();

  // --- SAFETY GUARD ---
  if (!product || !product.databaseId) {
    return null; 
  }

  // Helper to get raw price number (removes existing symbols if any)
  const rawPrice = product.price?.replace(/[^\d.]/g, "") || "0";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: product.id,
      databaseId: product.databaseId,
      title: product.name,
      price: parseFloat(rawPrice),
      image: product.image?.sourceUrl || "",
      quantity: 1,
      category: product.productCategories?.nodes[0]?.name || "General",
    });
    toggleCart(); 
  };

  return (
    <Link href={`/product/${product.databaseId}`} className="group block h-full">
      <div className="bg-white rounded-[2rem] p-3 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 h-full flex flex-col relative">
        
        {/* --- IMAGE SECTION --- */}
        <div className="relative aspect-[4/5] w-full rounded-[1.5rem] overflow-hidden mb-4 bg-gray-50">
          {product.image?.sourceUrl ? (
            <Image
              src={product.image.sourceUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-300">
              <span className="text-xs uppercase tracking-widest">No Image</span>
            </div>
          )}
          
          {/* Wishlist Button Removed Here */}
        </div>

        {/* --- CONTENT SECTION --- */}
        <div className="px-2 pb-2 flex flex-col flex-grow justify-between">
          <div>
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-serif text-lg font-bold text-gray-900 leading-tight group-hover:text-brand-gold transition-colors">
                {product.name}
              </h3>
              <div className="flex items-center gap-1 text-brand-gold shrink-0 ml-2">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-xs font-bold text-gray-900">4.9</span>
              </div>
            </div>
            
            <p className="text-gray-500 text-xs font-medium mb-5">
               {product.productCategories?.nodes[0]?.name || "Essential Oil"}
            </p>
          </div>

          <div className="flex items-center justify-between mt-auto">
            {/* Price with Rupee Logo */}
            <div className="text-lg font-bold text-gray-900 flex items-center font-serif">
              <span className="mr-1">₹</span>{rawPrice}
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="bg-brand-black text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-brand-gold transition-colors shadow-lg group/btn"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="text-sm font-bold">Add</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}