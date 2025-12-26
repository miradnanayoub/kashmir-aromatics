import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="bg-brand-cream min-h-screen">
      
      
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2576&auto=format&fit=crop"
            alt="Kashmir Valley"
            fill
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <span className="font-sans text-xs font-bold tracking-[0.3em] text-brand-gold uppercase mb-4 block">Our Story</span>
          <h1 className="font-serif text-5xl md:text-7xl">Rooted in the Valley</h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="font-serif text-3xl text-brand-black mb-8">The Essence of Kashmir</h2>
        <p className="font-sans text-gray-600 leading-relaxed mb-6">
          Kashmir Aromatics began with a simple promise: to bring the authentic, unadulterated scents of the Kashmir Valley to the world. For generations, our family has cultivated lavender, roses, and saffron in the rich, glacial soils of the Himalayas.
        </p>
        <p className="font-sans text-gray-600 leading-relaxed">
          We believe in slow beauty. Our oils are steam-distilled in small batches using traditional copper vessels, preserving the therapeutic integrity of every drop. No fillers, no synthetics—just pure plant alchemy.
        </p>
      </section>
    </main>
  );
}