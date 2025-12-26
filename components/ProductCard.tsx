"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

export default function ProductCard({ product }: { product: any }) {
  // FIX 1: We only ask for 'addItem'. We do NOT ask for 'toggleCart'.
  const { addItem } = useCart();

  // --- SAFETY GUARD ---
  if (!product || !product.databaseId) {
    return null; 
  }

  const priceValue = parseFloat(product.price?.replace(/[^\d.]/g, "") || "0");

  const displayPrice = priceValue.toLocaleString('en-IN', {
    maximumFractionDigits: 0, 
    minimumFractionDigits: 0
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    // Add item to global cart state
    addItem({
      id: product.databaseId.toString(),
      databaseId: product.databaseId,
      title: product.name,
      price: priceValue,
      image: product.image?.sourceUrl || "",
      quantity: 1,
      category: product.productCategories?.nodes[0]?.name || "General",
    });
    
    // FIX 2: Trigger Toast ONLY. The 'toggleCart()' line is deleted.
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="group relative block h-full">
      <div className="bg-white rounded-[0.8rem] md:rounded-[1.6rem] p-2 md:p-3 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 h-full flex flex-col relative">
        
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
            <div className="text-sm md:text-lg font-bold text-gray-900 flex items-center font-serif whitespace-nowrap">
              <span className="mr-0.5 md:mr-1">₹</span>{displayPrice}
            </div>

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