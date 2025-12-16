"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// 1. Define the Cart Item Type
export type CartItem = {
  id: string;          // GraphQL Global ID (e.g. "D4s...")
  databaseId: number;  // WordPress Database ID (e.g. 3291) - CRITICAL for Checkout
  title: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
};

// 2. Define the Context Interface
interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  toggleCart: () => void;
  isCartOpen: boolean;
  cartTotal: number;
  cartCount: number;
  checkout: () => void; // <--- This must be here!
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Load Cart from LocalStorage on mount
  useEffect(() => {
    setIsMounted(true);
    const savedCart = localStorage.getItem("kashmir-cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart data", error);
      }
    }
  }, []);

  // Save Cart to LocalStorage whenever it changes
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("kashmir-cart", JSON.stringify(items));
    }
  }, [items, isMounted]);

  const addItem = (newItem: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === newItem.id);
      if (existing) {
        return prev.map((i) =>
          i.id === newItem.id ? { ...i, quantity: i.quantity + newItem.quantity } : i
        );
      }
      return [...prev, newItem];
    });
    setIsCartOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: Math.max(1, item.quantity + delta) };
        }
        return item;
      })
    );
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = items.reduce((count, item) => count + item.quantity, 0);

  // --- CHECKOUT LOGIC ---
  const checkout = () => {
    // Debug Alert (Remove this later after it works)
    alert("Checkout Process Started!"); 
    console.log("--- DEBUG: Checkout Started ---");

    if (items.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    // Filter items to ensure they have the databaseId needed for WordPress
    const validItems = items.filter(item => item.databaseId);
    
    if (validItems.length === 0) {
      alert("Error: Items are missing their Product ID. Please clear the cart and add items again.");
      console.error("Error: No items have a valid databaseId. Check product mapping.");
      return;
    }

    // Construct the parameter string: "ID:QTY,ID:QTY"
    const cartString = validItems
      .map((item) => `${item.databaseId}:${item.quantity}`)
      .join(",");

    // The destination URL
    const url = `https://kashmiraromatics.in/?headless_cart=${cartString}`;
    
    console.log("Redirecting to:", url);
    
    // Perform the redirect
    window.location.href = url;
  };

  return (
    <CartContext.Provider
      value={{ 
        items, 
        addItem, 
        removeItem, 
        updateQuantity, 
        toggleCart, 
        isCartOpen, 
        cartTotal, 
        cartCount, 
        checkout // <--- Important: Passing the function to the app
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}