"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { ShoppingBag, Search, Menu, X, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { client } from "@/lib/apolloClient"; // Import your existing client
import { GET_SEARCH_RESULTS } from "@/lib/queries"; // Reuse your search query

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // --- SEARCH STATE ---
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null); // To detect clicks outside
  
  const router = useRouter();
  const { toggleCart, cartCount } = useCart();

  const navItems = [
    { name: "Shop", href: "/shop" },
    { name: "Hydrosols", href: "/shop/hydrosols" },      
    { name: "Essential Oils", href: "/shop/essential-oils" }, 
    { name: "Our Story", href: "/about" },        
  ];

  // 1. Handle Scroll Style
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. Handle "Click Outside" to close search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
        setResults([]); // Clear results on close
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 3. INSTANT SEARCH LOGIC (Debounced)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 2) { // Only search if 3+ chars
        setIsLoading(true);
        try {
          const { data } = await client.query<any>({
            query: GET_SEARCH_RESULTS,
            variables: { search: searchQuery },
            fetchPolicy: "no-cache" // Always get fresh data
          });
          setResults(data?.products?.nodes || []);
        } catch (error) {
          console.error("Instant search error:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 300); // Wait 300ms after typing stops

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Handle "Enter" Key Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      setResults([]);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

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
          
          {/* --- LOGO --- */}
          <div className="flex-shrink-0 cursor-pointer z-10">
            <Link href="/" className="block">
              <div className="relative w-32 h-10 md:w-40 md:h-12">
                <Image 
                  src={isScrolled ? "/logo-black.png" : "/logo-white.png"} 
                  alt="Kashmir Aromatics" 
                  fill 
                  className="object-contain" 
                  priority
                />
              </div>
            </Link>
          </div>

          {/* --- DESKTOP NAV --- */}
          {!isSearchOpen && (
            <nav className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium hover:text-amber-500 transition-colors ${textColorClass}`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          )}

          {/* --- ICONS & SEARCH --- */}
          <div className={`flex items-center gap-5 z-10 ${textColorClass}`}>
            
            {/* SEARCH CONTAINER */}
            <div ref={searchRef} className="relative">
              {isSearchOpen ? (
                <div className="relative">
                  <form onSubmit={handleSearchSubmit} className="flex items-center bg-white/10 rounded-full px-3 py-1 border border-gray-200 bg-white">
                    <input 
                      type="text" 
                      placeholder="Search products..." 
                      className="bg-transparent outline-none text-sm w-48 md:w-64 text-gray-900 placeholder:text-gray-400"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 ml-2 animate-spin text-amber-600" />
                    ) : (
                      <button type="button" onClick={() => { setIsSearchOpen(false); setResults([]); }}>
                        <X className="w-4 h-4 ml-2 text-gray-400 hover:text-red-500" />
                      </button>
                    )}
                  </form>

                  {/* INSTANT RESULTS DROPDOWN */}
                  {results.length > 0 && (
                    <div className="absolute top-full mt-2 right-0 w-72 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden max-h-96 overflow-y-auto">
                      {results.map((product) => (
                        <Link 
                          key={product.databaseId} 
                          href={`/product/${product.databaseId}`}
                          onClick={() => { setIsSearchOpen(false); setResults([]); }}
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                        >
                          <div className="relative w-10 h-10 flex-shrink-0 bg-gray-100 rounded">
                            {product.image?.sourceUrl && (
                              <Image 
                                src={product.image.sourceUrl} 
                                alt={product.name} 
                                fill 
                                className="object-cover rounded"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">{product.name}</h4>
                            <p className="text-xs text-amber-600">{product.price || "Check Price"}</p>
                          </div>
                        </Link>
                      ))}
                      <button 
                        onClick={handleSearchSubmit}
                        className="w-full text-center py-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-amber-600 hover:bg-gray-50"
                      >
                        View all {results.length} results
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => setIsSearchOpen(true)} 
                  className="hover:text-amber-500 transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>
            
            <button onClick={toggleCart} className="relative hover:text-amber-500 transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-600 text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-sans">
                  {cartCount}
                </span>
              )}
            </button>

            <button className="md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* --- MOBILE MENU --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col p-6">
          <div className="flex justify-end">
            <button onClick={() => setIsMobileMenuOpen(false)}>
              <X className="w-8 h-8 text-gray-900" />
            </button>
          </div>
          <nav className="flex flex-col gap-6 mt-10 items-center">
            {/* Simple Mobile Search (No instant dropdown for simplicity) */}
            <form onSubmit={handleSearchSubmit} className="w-full max-w-xs mb-4 flex border-b border-gray-300 pb-2">
               <Search className="w-5 h-5 text-gray-400 mr-2" />
               <input 
                  type="text" 
                  placeholder="Search products..." 
                  className="w-full outline-none text-gray-900"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
            </form>

            {[...navItems, { name: "Contact", href: "/contact" }].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl font-serif text-gray-900 hover:text-amber-600"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}