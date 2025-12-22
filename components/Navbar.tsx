"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation"; // Added usePathname
import { ShoppingBag, Search, Menu, X, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { client } from "@/lib/apolloClient"; 
import { GET_SEARCH_RESULTS } from "@/lib/queries"; 

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // --- SEARCH STATE ---
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null); 
  
  const router = useRouter();
  const pathname = usePathname(); // Get current URL path
  const { toggleCart, cartCount } = useCart();

  const navItems = [
    { name: "Shop", href: "/shop" },
    { name: "Hydrosols", href: "/shop/hydrosols" },      
    { name: "Essential Oils", href: "/shop/essential-oils" }, 
    { name: "Our Story", href: "/about" },        
  ];

  // --- LOGIC: WHICH PAGES HAVE HERO IMAGES? ---
  // If a page has a Hero Image, we want a Transparent Navbar at the top.
  // If NOT (like Track Order, Cart, Product), we want a Solid White Navbar always.
  const hasHeroImage = 
    pathname === "/" || 
    pathname === "/shop" || 
    pathname === "/about" || 
    pathname?.startsWith("/shop/"); // Includes categories like /shop/hydrosols

  // If we are scrolled OR if this page doesn't have a hero section, force the "Solid" look.
  const showSolidNav = isScrolled || !hasHeroImage;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ... (Search Logic remains same) ...
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
        setResults([]); 
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 2) { 
        setIsLoading(true);
        try {
          const { data } = await client.query<any>({
            query: GET_SEARCH_RESULTS,
            variables: { search: searchQuery },
            fetchPolicy: "no-cache" 
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
    }, 300); 

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      setResults([]);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Dynamic Styles based on showSolidNav
  const textColorClass = showSolidNav ? "text-gray-900" : "text-white";
  const logoSrc = showSolidNav ? "/logo-black.png" : "/logo-white.png";
  const headerBgClass = showSolidNav 
    ? "bg-white/95 backdrop-blur-md border-gray-100 py-3 shadow-sm"
    : "bg-transparent border-transparent py-5";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${headerBgClass}`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* --- MOBILE SEARCH OVERLAY --- */}
          {isSearchOpen && (
            <div className="absolute inset-0 bg-white z-[60] flex items-center px-6 md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
               <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center">
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 text-amber-600 animate-spin mr-3" />
                  ) : (
                    <Search className="w-5 h-5 text-gray-400 mr-3" />
                  )}
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="flex-1 outline-none text-gray-900 text-base h-full py-4"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
               </form>
               <button onClick={() => { setIsSearchOpen(false); setResults([]); }} className="p-2">
                 <X className="w-6 h-6 text-gray-600" />
               </button>
               {results.length > 0 && (
                 <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl max-h-[60vh] overflow-y-auto">
                    {results.map((product) => (
                      <Link 
                        key={product.databaseId} 
                        href={`/product/${product.databaseId}`}
                        onClick={() => { setIsSearchOpen(false); setResults([]); }}
                        className="flex items-center gap-4 p-4 hover:bg-gray-50 border-b border-gray-50"
                      >
                        <div className="relative w-12 h-12 bg-gray-100 rounded flex-shrink-0">
                          {product.image?.sourceUrl && (
                            <Image src={product.image.sourceUrl} alt={product.name} fill className="object-cover rounded" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                          <p className="text-xs text-amber-600">{product.price || "Check Price"}</p>
                        </div>
                      </Link>
                    ))}
                 </div>
               )}
            </div>
          )}

          {/* --- LOGO --- */}
          <div className={`flex-shrink-0 cursor-pointer z-10 ${isSearchOpen ? 'opacity-0 md:opacity-100' : 'opacity-100'}`}>
            <Link href="/" className="block">
              <div className="relative w-32 h-10 md:w-40 md:h-12">
                <Image 
                  src={logoSrc} 
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

          {/* --- ICONS --- */}
          <div className={`flex items-center gap-5 z-10 ${textColorClass}`}>
            
            <div ref={searchRef} className="hidden md:block relative">
              {isSearchOpen ? (
                <div className="relative">
                  <form onSubmit={handleSearchSubmit} className="flex items-center bg-white rounded-full px-3 py-1 border border-gray-200">
                    <input 
                      type="text" 
                      placeholder="Search..." 
                      className="bg-transparent outline-none text-sm w-48 lg:w-64 text-gray-900 placeholder:text-gray-400"
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
                  {results.length > 0 && (
                    <div className="absolute top-full mt-2 right-0 w-80 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden max-h-96 overflow-y-auto">
                      {results.map((product) => (
                        <Link 
                          key={product.databaseId} 
                          href={`/product/${product.databaseId}`}
                          onClick={() => { setIsSearchOpen(false); setResults([]); }}
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-50"
                        >
                          <div className="relative w-10 h-10 flex-shrink-0 bg-gray-100 rounded">
                            {product.image?.sourceUrl && (
                              <Image src={product.image.sourceUrl} alt={product.name} fill className="object-cover rounded" />
                            )}
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 truncate">{product.name}</h4>
                            <p className="text-xs text-amber-600">{product.price}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={() => setIsSearchOpen(true)} className="hover:text-amber-500 transition-colors">
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            <button onClick={() => setIsSearchOpen(true)} className="md:hidden hover:text-amber-500 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            
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
      
      {/* Mobile Menu logic... (Keep existing) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col p-6 transition-opacity duration-300">
          <div className="flex justify-end">
            <button onClick={() => setIsMobileMenuOpen(false)}>
              <X className="w-8 h-8 text-gray-900" />
            </button>
          </div>
          <nav className="flex flex-col gap-6 mt-10 items-center">
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