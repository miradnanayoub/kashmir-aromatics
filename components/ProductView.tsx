"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";

// Define what data this component expects
interface ProductViewProps {
  product: {
    id: string;
    databaseId: number;
    title: string;
    price: number;
    description: string;
    category: string;
    images: string[];
    stockStatus: string;
  };
}

export default function ProductView({ product }: ProductViewProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<string | null>("description");
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      databaseId: product.databaseId,
      title: product.title,
      price: product.price,
      image: product.images[0], // Use the first image as thumbnail
      quantity: quantity,
      category: product.category,
    });
  };

  return (
    <div className="pt-24 md:pt-32 max-w-7xl mx-auto px-4 md:px-6 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
        
        {/* --- LEFT: IMAGE GALLERY --- */}
        <div className="relative">
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:grid md:grid-cols-1 md:gap-6 hide-scrollbar">
            {product.images.map((img, index) => (
              <div key={index} className="snap-center min-w-full md:min-w-0 relative aspect-square bg-gray-100 rounded-sm overflow-hidden">
                <Image
                  src={img}
                  alt={product.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
          {/* Mobile Dots */}
          {product.images.length > 1 && (
            <div className="flex justify-center gap-2 mt-4 md:hidden">
              {product.images.map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-brand-black/20"></div>
              ))}
            </div>
          )}
        </div>

        {/* --- RIGHT: DETAILS --- */}
        <div className="md:sticky md:top-32 h-fit">
          <span className="text-xs font-sans font-bold tracking-[0.2em] text-brand-gold uppercase mb-2 block">
            {product.category}
          </span>
          
          <h1 className="font-serif text-3xl md:text-5xl text-brand-black mb-4">
            {product.title}
          </h1>

          <p className="font-sans text-xl font-medium text-gray-600 mb-6">
            ₹{product.price.toLocaleString()}
          </p>

          {/* Render HTML Description Safely */}
          <div 
            className="font-sans text-gray-600 leading-relaxed mb-8 text-sm md:text-base prose prose-sm"
            dangerouslySetInnerHTML={{ __html: product.description }} 
          />

          {/* Add to Cart Section */}
          <div className="flex flex-col gap-4 mb-10 border-b border-gray-200 pb-10">
            <div className="flex items-center mb-2">
              <span className="text-xs font-bold uppercase tracking-widest mr-4">Quantity</span>
              <div className="flex items-center border border-gray-300">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-gray-100"><Minus size={14} /></button>
                <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-gray-100"><Plus size={14} /></button>
              </div>
            </div>

            <button 
              onClick={handleAddToCart}
              disabled={product.stockStatus !== 'IN_STOCK'}
              className="w-full bg-brand-black text-white py-4 font-sans text-sm font-bold uppercase tracking-widest hover:bg-brand-gold transition-colors duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {product.stockStatus === 'IN_STOCK' 
                ? `Add to Cart — ₹${(product.price * quantity).toLocaleString()}` 
                : 'Out of Stock'}
            </button>
          </div>

          {/* Accordions */}
          <div className="flex flex-col gap-0">
             <div className="border-b border-gray-200">
                <button onClick={() => setActiveTab(activeTab === 'shipping' ? null : 'shipping')} className="w-full py-4 flex items-center justify-between text-left">
                  <span className="font-serif text-lg text-brand-black">Shipping & Returns</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeTab === 'shipping' ? 'rotate-180' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${activeTab === 'shipping' ? 'max-h-40 mb-4' : 'max-h-0'}`}>
                  <p className="text-sm text-gray-500">Free shipping on orders over ₹999. Returns accepted within 7 days.</p>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}