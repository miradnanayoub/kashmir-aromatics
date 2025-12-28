import Navbar from "@/components/Navbar";
import FeaturedCollection from "@/components/FeaturedCollection";
import RevealOnScroll from "@/components/RevealOnScroll"; 
import Image from "next/image";
import Link from "next/link";
import { Mountain, FlaskConical, Users, ArrowRight } from "lucide-react";

// --- IMPORTANT: NO "use client" HERE ---
// This allows FeaturedCollection (async) to run on the server
// while RevealOnScroll handles the client-side animation logic.

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAFAF9]">
            
      {/* 1. HERO SECTION */}
      <section className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden">
        {/* Background Image - Added 'animate-slow-zoom' */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?q=80&w=2000&auto=format&fit=crop" 
            alt="Kashmir Valley"
            fill
            className="object-cover brightness-[0.70] animate-slow-zoom" 
            priority
          />
        </div>

        {/* Content - Added 'animate-fade-in-up' classes for load animation */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-15">
          <span className="font-sans text-xs md:text-sm font-bold tracking-[0.3em] text-brand-gold uppercase mb-6 block animate-fade-in-up">
            Pure & Authentic
          </span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-8 leading-none animate-fade-in-up delay-100">
            The Valley's <br />
            <span className="italic font-light">Aromatic Tale</span>
          </h1>
          <p className="font-sans text-gray-200 text-lg md:text-xl max-w-xl mx-auto mb-10 font-light leading-relaxed animate-fade-in-up delay-200">
            Handcrafted essential oils, hydrosols, and botanical treasures from the heart of Kashmir.
          </p>
          
          <div className="animate-fade-in-up delay-300">
            <Link 
              href="/shop"
              className="inline-block bg-[#1A1A1A] text-white px-10 py-4 rounded-full font-sans text-xs font-bold uppercase tracking-widest hover:bg-[#D4AF37] hover:scale-105 transition-all duration-500 shadow-lg"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* 2. FEATURED PRODUCTS - Wrapped in RevealOnScroll */}
      {/* Since page is Server, and RevealOnScroll is Client, this pattern works perfectly. */}
      <div className="py-12 md:py-0">
        <RevealOnScroll>
          <FeaturedCollection />
        </RevealOnScroll>
      </div>

      {/* 3. WHY KASHMIR AROMATICS? - Wrapped with Staggered Delays */}
      <section className="py-24 bg-[#1A1A1A] text-white">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header Reveal */}
          <RevealOnScroll>
            <div className="text-center mb-16">
              <span className="text-brand-gold font-bold tracking-[0.2em] text-xs uppercase mb-3 block">
                The Standard
              </span>
              <h2 className="text-3xl md:text-5xl font-serif text-white">Why Kashmir Aromatics?</h2>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Value 1: Altitude - Delay 100ms */}
            <RevealOnScroll>
              <div className="bg-[#262626] p-10 rounded-[2rem] hover:bg-[#333] transition-colors duration-500 border border-white/5 group h-full">
                <div className="w-16 h-16 bg-brand-gold/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-brand-gold/20 transition-colors duration-500">
                  <Mountain className="w-8 h-8 text-brand-gold group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="text-2xl font-serif mb-4">High-Altitude Potency</h3>
                <p className="text-gray-400 font-light leading-relaxed">
                  Grown at 1,600m above sea level, our botanicals develop higher concentrations of therapeutic compounds due to the thin air and intense UV exposure.
                </p>
              </div>
            </RevealOnScroll>

            {/* Value 2: Distillation - Delay 200ms */}
            <RevealOnScroll>
              <div className="bg-[#262626] p-10 rounded-[2rem] hover:bg-[#333] transition-colors duration-500 border border-white/5 group h-full">
                <div className="w-16 h-16 bg-brand-gold/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-brand-gold/20 transition-colors duration-500">
                  <FlaskConical className="w-8 h-8 text-brand-gold group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="text-2xl font-serif mb-4">Copper Distilled</h3>
                <p className="text-gray-400 font-light leading-relaxed">
                  We reject industrial steel. Every drop is distilled in traditional copper <em>degs</em> over open wood fires, removing sulfur notes and sweetening the aroma.
                </p>
              </div>
            </RevealOnScroll>

            {/* Value 3: Community - Delay 300ms */}
            <RevealOnScroll>
              <div className="bg-[#262626] p-10 rounded-[2rem] hover:bg-[#333] transition-colors duration-500 border border-white/5 group h-full">
                <div className="w-16 h-16 bg-brand-gold/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-brand-gold/20 transition-colors duration-500">
                  <Users className="w-8 h-8 text-brand-gold group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="text-2xl font-serif mb-4">Direct Trade</h3>
                <p className="text-gray-400 font-light leading-relaxed">
                  We pay our farmers 3x the market rate. By cutting out middlemen, we ensure freshness for you and a dignified livelihood for the growers.
                </p>
              </div>
            </RevealOnScroll>

          </div>
          
          {/* Footer Link Reveal - Delay 400ms */}
          <RevealOnScroll>
            <div className="mt-16 text-center">
              <Link 
                href="/about" 
                className="inline-flex items-center gap-2 text-brand-gold font-bold uppercase tracking-widest text-xs hover:text-white transition-colors duration-300 group"
              >
                Read the full story <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>

    </main>
  );
}