"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Search, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { toggleCart, cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      // Change state when scrolled more than 20px
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // TEXT COLOR LOGIC: White when transparent (top), Black when white (scrolled)
  const textColorClass = isScrolled ? "text-gray-900" : "text-white";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md border-gray-100 py-3 shadow-sm"
            : "bg-transparent border-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* --- 1. LOGO SECTION (LEFT) --- */}
          <div className="flex-shrink-0 cursor-pointer z-10">
            <Link href="/" className="block">
              <div className="relative w-32 h-10 md:w-40 md:h-12">
                <Image 
                  // CHANGE THIS: Ensure you have 'logo-white.png' and 'logo-black.png' in your public folder
                  src={isScrolled ? "/logo-black.png" : "/logo-white.png"} 
                  alt="Kashmir Aromatics" 
                  fill 
                  className="object-contain" 
                  priority
                />
              </div>
            </Link>
          </div>

          {/* --- 2. DESKTOP NAVIGATION (CENTER) --- */}
          {/* absolute + left-1/2 + -translate-x-1/2 ensures perfect centering */}
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
            {["Shop", "Hydrosols", "Essential Oils", "Our Story"].map((item) => (
              <Link
                key={item}
                href={item === "Shop" ? "/shop" : `/shop/${item.toLowerCase().replace(" ", "-")}`}
                className={`text-sm font-medium hover:text-amber-500 transition-colors ${textColorClass}`}
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* --- 3. ICONS (RIGHT) --- */}
          <div className={`flex items-center gap-5 z-10 ${textColorClass}`}>
            <button className="hover:text-amber-500 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            
            {/* CART BUTTON */}
            <button 
              onClick={toggleCart} 
              className="relative hover:text-amber-500 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-600 text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-sans">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

        </div>
      </header>

      {/* --- MOBILE MENU OVERLAY --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col p-6 transition-opacity duration-300">
          <div className="flex justify-end">
            <button onClick={() => setIsMobileMenuOpen(false)}>
              <X className="w-8 h-8 text-gray-900" />
            </button>
          </div>
          <nav className="flex flex-col gap-6 mt-10 items-center">
            {["Shop", "Hydrosols", "Essential Oils", "Our Story", "Contact"].map((item) => (
              <Link
                key={item}
                href={item === "Shop" ? "/shop" : `/${item.toLowerCase().replace(" ", "-")}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl font-serif text-gray-900 hover:text-amber-600"
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}