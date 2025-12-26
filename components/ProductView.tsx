"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Star, Minus, Plus, ShoppingBag, ShieldCheck, Truck, Leaf } from "lucide-react";
import toast from "react-hot-toast";

export default function ProductView({ product }: { product: any }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  // --- Dynamic Data ---
  const ratingValue = parseFloat(product.averageRating) || 0;
  const reviewCount = product.reviewCount || 0;

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
    <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen flex items-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 w-full">
        
        {/* --- LEFT: IMAGE GALLERY --- */}
        <div className="flex flex-col gap-6">
          <div className="relative aspect-[4/5] bg-[#F5F5F0] rounded-3xl overflow-hidden shadow-sm border border-white/50">
            <Image
              src={selectedImage}
              alt={product.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          
          {product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar px-1">
              {product.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-24 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                    selectedImage === img 
                      ? "border-brand-gold ring-1 ring-brand-gold/20 scale-105" 
                      : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"
                  }`}
                >
                  <Image src={img} alt="Thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* --- RIGHT: PRODUCT DETAILS --- */}
        <div className="flex flex-col justify-center lg:pl-4">
          
          <div className="mb-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-[0.2em] text-brand-gold uppercase bg-brand-gold/10 px-3 py-1 rounded-full">
                {product.category}
              </span>

              {ratingValue > 0 && (
                <div className="flex items-center gap-1.5 bg-white border border-gray-100 px-3 py-1 rounded-full shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-brand-gold text-brand-gold" />
                  <span className="text-sm font-bold text-gray-900">{ratingValue.toFixed(1)}</span>
                  <span className="text-xs text-gray-400 border-l border-gray-200 pl-1.5 ml-1">
                    {reviewCount} Rev
                  </span>
                </div>
              )}
            </div>

            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl text-gray-900 leading-[1.1] tracking-tight">
              {product.title}
            </h1>
          </div>

          <div className="mb-8 md:mb-10">
            <div className="text-3xl md:text-4xl font-serif text-gray-900 mb-6 flex items-baseline gap-1">
              <span className="text-lg text-gray-500 font-sans font-light">INR</span>
              <span className="font-medium tracking-tight">₹{displayPrice}</span>
            </div>

            <div 
              className="prose prose-stone prose-lg text-gray-600 font-sans leading-relaxed max-w-none text-base"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>

          {/* --- FIXED ACTIONS BAR (Mobile: Row Layout) --- */}
          <div className="flex flex-row gap-3 sm:gap-4 border-t border-gray-100 pt-6 mt-auto w-full">
            
            {/* Quantity Selector: Compact Width on Mobile */}
            <div className="flex items-center justify-between bg-white border border-gray-200 rounded-full px-2 sm:px-6 h-12 sm:h-14 w-28 sm:w-48 shadow-sm shrink-0">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-full flex items-center justify-center text-gray-400 hover:text-black transition-colors active:scale-90"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <span className="font-mono font-medium text-base sm:text-lg text-gray-900 text-center select-none w-6">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-full flex items-center justify-center text-gray-400 hover:text-black transition-colors active:scale-90"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Add to Cart Button: Takes remaining width */}
            <button
              onClick={handleAddToCart}
              disabled={product.stockStatus === 'OUT_OF_STOCK'}
              className="flex-1 bg-gray-900 text-white h-12 sm:h-14 rounded-full flex items-center justify-center gap-2 sm:gap-3 font-bold uppercase tracking-wider text-xs sm:text-sm hover:bg-brand-gold hover:text-white transition-all duration-300 shadow-xl shadow-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="truncate">
                {product.stockStatus === 'OUT_OF_STOCK' ? 'Out of Stock' : 'Add to Cart'}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-8 pt-6 border-t border-dashed border-gray-200">
            <div className="flex flex-col items-center gap-2 text-center group">
              <div className="p-2.5 bg-green-50 rounded-full text-green-700 group-hover:bg-green-100 transition-colors">
                <Leaf className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Organic</span>
            </div>

            <div className="flex flex-col items-center gap-2 text-center group">
              <div className="p-2.5 bg-blue-50 rounded-full text-blue-700 group-hover:bg-blue-100 transition-colors">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Secure</span>
            </div>

            <div className="flex flex-col items-center gap-2 text-center group">
              <div className="p-2.5 bg-amber-50 rounded-full text-amber-700 group-hover:bg-amber-100 transition-colors">
                <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Fast Ship</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}