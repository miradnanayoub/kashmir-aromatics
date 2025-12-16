import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";

interface ProductCardProps {
  id: string;
  title: string;
  category: string;
  price: number;
  image: string;
}

export default function ProductCard({ id, title, category, price, image }: ProductCardProps) {
  return (
    <div className="group relative block h-full">
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100 mb-3 md:mb-4">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Quick Add Button 
            - Hidden on mobile (opacity-0 by default) to keep view clean
            - Only appears on hover (which implies desktop/mouse interaction)
        */}
        <button className="hidden md:block absolute bottom-4 right-4 bg-white text-brand-black p-3 rounded-full opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 shadow-md hover:bg-brand-black hover:text-white">
          <Plus size={20} />
        </button>
      </div>

      {/* Product Info - Optimized text sizes for mobile */}
      <div className="text-center px-1">
        <span className="text-[9px] md:text-[10px] font-sans font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] text-brand-gold mb-1 block truncate">
          {category}
        </span>
        
        <h3 className="font-serif text-sm md:text-lg text-brand-black mb-1 group-hover:text-brand-gold transition-colors leading-tight">
          <Link href={`/product/${id}`}>
            {title}
          </Link>
        </h3>
        
        <p className="font-sans text-xs md:text-sm text-gray-500 font-medium">
          ₹{price.toLocaleString()}
        </p>
      </div>
    </div>
  );
}