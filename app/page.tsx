import Navbar from "@/components/Navbar";
import FeaturedCollection from "@/components/FeaturedCollection";
import Image from "next/image";
import Link from "next/link"; // Fixed import path

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAFAF9]">
      <Navbar />
      
      {/* HERO SECTION */}
      <section className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?q=80&w=2000&auto=format&fit=crop" 
            alt="Kashmir Valley"
            fill
            className="object-cover brightness-[0.70]" 
            priority
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <span className="font-sans text-xs md:text-sm font-bold tracking-[0.3em] text-brand-gold uppercase mb-6 block">
            Pure & Authentic
          </span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-8 leading-none">
            The Valley's <br />
            <span className="italic font-light">Aromatic Tale</span>
          </h1>
          <p className="font-sans text-gray-200 text-lg md:text-xl max-w-xl mx-auto mb-10 font-light leading-relaxed">
            Handcrafted essential oils, hydrosols, and botanical treasures from the heart of Kashmir.
          </p>
          
          {/* UPDATED BUTTON: Rounded Pill + Brand Colors */}
          <Link 
            href="/shop"
            className="inline-block bg-brand-gold text-white px-10 py-4 rounded-2xl font-sans text-xs font-bold uppercase tracking-widest hover:bg-brand-black transition-colors duration-300 shadow-lg"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <FeaturedCollection />

    </main>
  );
}