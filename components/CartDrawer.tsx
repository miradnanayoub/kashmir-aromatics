"use client";

import { useCart } from "@/context/CartContext";
import { X, Minus, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Import Router

export default function CartDrawer() {
  const { 
    isCartOpen, 
    toggleCart, 
    items, 
    removeItem, 
    updateQuantity, 
    cartTotal 
  } = useCart(); // Removed 'checkout' from here

  const router = useRouter(); // Initialize Router

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    toggleCart(); // Close the drawer first
    router.push("/checkout"); // Navigate to the new page
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity"
        onClick={toggleCart}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-white z-[101] shadow-2xl flex flex-col transform transition-transform duration-300 ease-out">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="font-serif text-2xl text-brand-black flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Your Cart ({items.length})
          </h2>
          <button 
            onClick={toggleCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <ShoppingBag className="w-12 h-12 text-gray-200" />
              <p className="text-gray-400 font-sans">Your bag is empty.</p>
              <button 
                onClick={toggleCart}
                className="text-brand-gold font-bold uppercase tracking-widest text-xs border-b border-brand-gold pb-1 hover:text-black hover:border-black transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 animate-fade-in-up">
                {/* Image */}
                <div className="relative w-20 h-24 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                  <Image 
                    src={item.image} 
                    alt={item.title} 
                    fill 
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-serif text-gray-900 leading-tight pr-4">
                        {item.title}
                      </h3>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">
                      {item.category}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Quantity Control */}
                    <div className="flex items-center border border-gray-200 rounded-full px-2 py-1 gap-3">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:text-brand-gold transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-3 text-center">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:text-brand-gold transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price */}
                    <span className="font-bold text-gray-900">
                       ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-[#FAFAF9]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm font-bold uppercase tracking-widest text-gray-500">Subtotal</span>
              <span className="font-serif text-2xl text-gray-900">
                ₹{cartTotal.toLocaleString("en-IN")}
              </span>
            </div>
            <p className="text-xs text-center text-gray-400 mb-4">
              Shipping & taxes calculated at checkout.
            </p>
            
            {/* UPDATED BUTTON */}
            <button
              onClick={handleCheckout}
              className="w-full bg-[#1A1A1A] text-white py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#D4AF37] transition-all duration-300 shadow-lg"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}