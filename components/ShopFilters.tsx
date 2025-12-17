"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function ShopFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current active filters from URL
  const currentCategory = searchParams.get("category") || "";
  const currentSort = searchParams.get("sort") || "date";

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // Push new URL; Server Component will re-render with new data
    // We check pathname to ensure we stay on the current page
    const path = window.location.pathname; 
    router.push(`${path}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
      {/* Categories Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleFilterChange("category", "")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
            !currentCategory
              ? "bg-amber-600 text-white border-amber-600"
              : "bg-white text-gray-700 border-gray-200 hover:border-amber-600"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleFilterChange("category", String(cat.id))}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
              currentCategory === String(cat.id)
                ? "bg-amber-600 text-white border-amber-600"
                : "bg-white text-gray-700 border-gray-200 hover:border-amber-600"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Sort Dropdown */}
      <div className="relative">
        <select
          value={currentSort}
          onChange={(e) => handleFilterChange("sort", e.target.value)}
          className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-4 pr-8 rounded-lg text-sm focus:outline-none focus:border-amber-600 cursor-pointer"
        >
          <option value="date">Newest Arrivals</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="title">Name (A-Z)</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}