"use client";

import Image from "next/image";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  // Get checkout function
  const { isCartOpen, toggleCart, items, removeItem, updateQuantity, cartTotal, checkout } = useCart();

  // DEBUG: Prove it rendered
  console.log("DRAWER RENDERED. Checkout fn:", !!checkout);

  if (!isCartOpen) return null;

  return (
    <div className="relative z-[200]"> 
      {/* 1. The Dark Backdrop (z-index 40) */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={toggleCart} // Clicking background closes drawer
      />

      {/* 2. The Drawer Panel (z-index 50 - HIGHER than backdrop) */}
      <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-brand-cream shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out">
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-brand-black/10">
          <h2 className="font-serif text-2xl text-brand-black flex items-center gap-2">
            Your Cart <span className="text-sm font-sans text-gray-500">({items.length})</span>
          </h2>
          <button 
            onClick={toggleCart}
            className="p-2 hover:bg-black/5 rounded-full transition-colors"
          >
            <X size={24} className="text-brand-black" />
          </button>
        </div>

        {/* ITEMS LIST */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-400">
              <ShoppingBag size={48} className="opacity-20" />
              <p>Your cart is empty.</p>
              <button onClick={toggleCart} className="text-brand-black underline text-sm font-bold tracking-widest uppercase">
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative w-24 h-32 bg-gray-100 shrink-0">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-serif text-lg text-brand-black leading-tight">{item.title}</h3>
                      <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500">
                        <X size={16} />
                      </button>
                    </div>
                    <p className="text-xs text-brand-gold font-bold tracking-widest uppercase">{item.category}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-300">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:bg-gray-100"><Minus size={12} /></button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:bg-gray-100"><Plus size={12} /></button>
                    </div>
                    <p className="font-medium text-brand-black">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER */}
        {items.length > 0 && (
          <div className="p-6 bg-white border-t border-brand-black/10">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm font-bold uppercase tracking-widest text-gray-500">Subtotal</span>
              <span className="font-serif text-2xl text-brand-black">₹{cartTotal.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-400 mb-4 text-center">Shipping & taxes calculated at checkout.</p>
            
            {/* --- THE CHECKOUT BUTTON --- */}
            <button 
              onClick={() => {
                // Direct Inline Debug
                console.log("Button CLICKED!"); 
                checkout();
              }}
              className="w-full bg-brand-black text-white py-4 font-sans text-sm font-bold uppercase tracking-widest hover:bg-brand-gold transition-colors duration-300 shadow-lg relative z-[60]"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}