"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Star, Minus, Plus, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";

export default function ProductView({ product }: { product: any }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  const displayPrice = product.price.toLocaleString('en-IN', {
    maximumFractionDigits: 0, 
    minimumFractionDigits: 0
  });

  const handleAddToCart = () => {
    addItem({
      id: product.databaseId.toString(),
      databaseId: product.databaseId,
      title: product.title,
      price: product.price,
      image: product.images[0],
      quantity: quantity,
      category: product.category,
    });
    
    toast.success(`${product.title} added to cart`);
  };

  return (
    <section className="pt-28 md:pt-32 pb-12 md:pb-20 px-4 md:px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20">
        
        {/* --- LEFT: IMAGE GALLERY --- */}
        <div className="space-y-4">
          <div className="relative aspect-[4/5] bg-gray-100 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-sm">
            <Image
              src={selectedImage}
              alt={product.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          
          {product.images.length > 1 && (
            <div className="flex gap-3 md:gap-4 overflow-x-auto pb-2 no-scrollbar">
              {product.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-16 h-20 md:w-20 md:h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === img ? "border-brand-gold" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt="Thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* --- RIGHT: PRODUCT DETAILS --- */}
        <div className="flex flex-col justify-center">
          
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-brand-gold uppercase">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-brand-gold">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-bold text-gray-900">4.9</span>
              <span className="text-gray-400 text-xs ml-1">(128 Reviews)</span>
            </div>
          </div>

          <h1 className="font-serif text-3xl md:text-5xl text-gray-900 mb-4 md:mb-6 leading-tight">
            {product.title}
          </h1>

          <div className="text-2xl md:text-3xl font-serif text-gray-900 mb-6 md:mb-8 flex items-center">
            <span className="mr-1">₹</span>{displayPrice}
          </div>

          <div 
            className="prose prose-stone text-gray-600 font-sans mb-8 md:mb-10 leading-relaxed max-w-none text-sm md:text-base"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />

          {/* --- ACTIONS SECTION (SINGLE LINE FIXED) --- */}
          <div className="flex flex-row gap-3 md:gap-4 border-t border-gray-200 pt-8">
            
            {/* Quantity Selector: 
                - Compact on mobile (px-3 gap-3)
                - Standard on desktop (md:px-6 md:gap-6)
            */}
            <div className="flex items-center bg-white border border-gray-300 rounded-full px-3 gap-3 md:px-6 md:gap-6 h-14 w-auto shrink-0">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-gray-500 hover:text-black transition-colors p-1"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-bold text-lg w-4 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="text-gray-500 hover:text-black transition-colors p-1"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart Button:
                - flex-1 (Takes all remaining space)
                - text-xs on mobile (prevents wrapping)
            */}
            <button
              onClick={handleAddToCart}
              disabled={product.stockStatus === 'OUT_OF_STOCK'}
              className="flex-1 bg-[#1A1A1A] text-white h-14 min-h-[3.5rem] rounded-full flex items-center justify-center gap-2 md:gap-3 font-bold uppercase tracking-wider hover:bg-[#D4AF37] transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group whitespace-nowrap"
            >
              <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
              <span className="text-xs md:text-base">
                {product.stockStatus === 'OUT_OF_STOCK' ? 'Out of Stock' : 'Add to Cart'}
              </span>
            </button>
          </div>

          {/* --- TRUST BADGES --- */}
          <div className="grid grid-cols-3 gap-2 md:gap-4 mt-10 md:mt-12 pt-8 border-t border-gray-100">
            <div className="text-center flex flex-col items-center">
              <div className="text-brand-gold mb-3">
                <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-[10px] md:text-xs uppercase font-bold tracking-wider text-gray-900">
                100% Organic
              </span>
            </div>

            <div className="text-center border-l border-gray-100 flex flex-col items-center">
              <div className="text-brand-gold mb-3">
                <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <span className="text-[10px] md:text-xs uppercase font-bold tracking-wider text-gray-900">
                Secure Pay
              </span>
            </div>

            <div className="text-center border-l border-gray-100 flex flex-col items-center">
              <div className="text-brand-gold mb-3">
                <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-[10px] md:text-xs uppercase font-bold tracking-wider text-gray-900">
                Fast Ship
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}