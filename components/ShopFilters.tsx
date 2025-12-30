"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, SlidersHorizontal, X, Loader2 } from "lucide-react"; // Added Loader2
import { useState, useEffect } from "react"; // Added useEffect

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function ShopFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  
  // New State: Track which category is currently being loaded
  const [pendingCategory, setPendingCategory] = useState<string | null>(null);

  // Get current active filters
  const currentCategory = searchParams.get("category");
  const currentSort = searchParams.get("sort") || "date";

  // Reset pending state when URL changes (navigation complete)
  useEffect(() => {
    setPendingCategory(null);
  }, [searchParams]);

  // Category Handler
  const handleCategoryChange = (catId: string | null) => {
    // 1. Set the pending state immediately for UI feedback
    setPendingCategory(catId ?? 'all');

    const params = new URLSearchParams(searchParams.toString());
    if (catId) {
      params.set("category", catId);
    } else {
      params.delete("category");
    }
    router.push(`/shop?${params.toString()}`);
  };

  // Sort Handler
  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="mb-6 w-full relative z-20"> 
      
      {/* --- TOP BAR: COMPACT SINGLE ROW --- */}
      <div className="flex flex-row items-center justify-between gap-2 pb-4 border-b border-gray-100">
        
        {/* Left: Compact Filter Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all border shrink-0 ${
            isOpen 
              ? "bg-brand-black text-white border-brand-black" 
              : "bg-white text-gray-900 border-gray-200 hover:border-gray-400"
          }`}
        >
          {isOpen ? <X className="w-3.5 h-3.5" /> : <SlidersHorizontal className="w-3.5 h-3.5" />}
          <span>Filter</span>
          <span className="hidden sm:inline"> Categories</span>
        </button>

        {/* Right: Integrated Sort Section */}
        <div className="flex items-center justify-end gap-2 flex-1 min-w-0">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
            Sort By:
          </span>
          
          <div className="relative">
            <select
              value={currentSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="appearance-none bg-transparent text-gray-900 text-[10px] sm:text-xs font-bold uppercase tracking-widest py-2 pr-5 pl-1 text-right focus:outline-none cursor-pointer hover:text-brand-black transition-colors"
            >
              <option value="date">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="title">Name: A-Z</option>
            </select>
            <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* --- EXPANDABLE CATEGORY DRAWER --- */}
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white rounded-xl">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 pl-1">
              Select Category
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {/* ALL ITEMS BUTTON */}
              <button
                  onClick={() => handleCategoryChange(null)}
                  disabled={pendingCategory !== null} // Prevent double clicks
                  className={`px-4 py-2 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-2 ${
                  // CONDITIONAL STYLING LOGIC:
                  pendingCategory === 'all' 
                      ? "border-brand-gold text-brand-gold bg-white" // LOADING STATE (Outline)
                      : !currentCategory
                          ? "bg-brand-gold text-white border-brand-gold shadow-md shadow-brand-gold/20" // ACTIVE STATE
                          : "bg-gray-50 text-gray-600 border-transparent hover:bg-gray-100" // INACTIVE STATE
                  }`}
              >
                  {pendingCategory === 'all' && <Loader2 className="w-3 h-3 animate-spin" />}
                  All Items
              </button>
              
              {/* CATEGORY LIST */}
              {categories.map((cat) => (
                  <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(String(cat.id))}
                  disabled={pendingCategory !== null}
                  className={`px-4 py-2 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-2 ${
                      // CONDITIONAL STYLING LOGIC:
                      pendingCategory === String(cat.id)
                        ? "border-brand-gold text-brand-gold bg-white" // LOADING STATE (Outline)
                        : currentCategory === String(cat.id)
                            ? "bg-brand-gold text-white border-brand-gold shadow-md shadow-brand-gold/20" // ACTIVE STATE
                            : "bg-gray-50 text-gray-600 border-transparent hover:bg-gray-100" // INACTIVE STATE
                  }`}
                  >
                  {pendingCategory === String(cat.id) && <Loader2 className="w-3 h-3 animate-spin" />}
                  {cat.name}
                  </button>
              ))}
            </div>
        </div>
      </div>
      
    </div>
  );
}