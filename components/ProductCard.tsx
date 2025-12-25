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

  // 1. Parse the price to a clean Number (removes currency symbols and string artifacts)
  const priceValue = parseFloat(product.price?.replace(/[^\d.]/g, "") || "0");

  // 2. Format for Display: Indian Locale, No Decimals (e.g., "2,500")
  const displayPrice = priceValue.toLocaleString('en-IN', {
    maximumFractionDigits: 0, 
    minimumFractionDigits: 0
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    // No need for preventDefault as button is z-20 above the Link overlay
    addItem({
      id: product.databaseId.toString(), // Force unique string ID
      databaseId: product.databaseId,
      title: product.name,
      price: priceValue, // Send raw number to cart
      image: product.image?.sourceUrl || "",
      quantity: 1,
      category: product.productCategories?.nodes[0]?.name || "General",
    });
    toggleCart(); 
  };

  return (
    <div className="group relative block h-full">
      
      <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-2 md:p-3 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 h-full flex flex-col relative">
        
        {/* Overlay Link (Z-10) */}
        <Link 
          href={`/product/${product.databaseId}`} 
          className="absolute inset-0 z-10 rounded-[1.5rem] md:rounded-[2rem]"
          aria-label={`View ${product.name}`}
        />

        {/* --- IMAGE SECTION --- */}
        <div className="relative aspect-[4/5] w-full rounded-[1rem] md:rounded-[1.5rem] overflow-hidden mb-3 md:mb-4 bg-gray-50">
          {product.image?.sourceUrl ? (
            <Image
              src={product.image.sourceUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-300">
              <span className="text-[10px] uppercase tracking-widest">No Image</span>
            </div>
          )}
        </div>

        {/* --- CONTENT SECTION --- */}
        <div className="px-1 md:px-2 pb-1 md:pb-2 flex flex-col flex-grow justify-between">
          <div>
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-serif text-sm md:text-lg font-bold text-gray-900 leading-tight group-hover:text-brand-gold transition-colors line-clamp-2">
                {product.name}
              </h3>
              
              <div className="flex items-center gap-1 text-brand-gold shrink-0 ml-1 md:ml-2">
                <Star className="w-3 h-3 md:w-4 md:h-4 fill-current" />
                <span className="text-[10px] md:text-xs font-bold text-gray-900">4.9</span>
              </div>
            </div>
            
            <p className="text-gray-500 text-[10px] md:text-xs font-medium mb-3 md:mb-5 line-clamp-1">
               {product.productCategories?.nodes[0]?.name || "Essential Oil"}
            </p>
          </div>

          <div className="flex items-center justify-between mt-auto gap-2">
            
            {/* PRICE: Cleaned and Formatted (e.g. ₹250) */}
            <div className="text-sm md:text-lg font-bold text-gray-900 flex items-center font-serif whitespace-nowrap">
              <span className="mr-0.5 md:mr-1">₹</span>{displayPrice}
            </div>

            {/* BUTTON (Z-20) */}
            <button
              onClick={handleAddToCart}
              className="relative z-20 bg-brand-black text-white p-2.5 md:px-6 md:py-3 rounded-full flex items-center justify-center gap-2 hover:bg-brand-gold transition-colors shadow-lg group/btn shrink-0"
              aria-label="Add to cart"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="text-sm font-bold hidden md:block">Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}