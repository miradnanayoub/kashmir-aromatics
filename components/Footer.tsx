import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-brand-black text-brand-cream border-t border-white/10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
        {/* Column 1: Brand & Logo */}
        <div className="space-y-6">
          <div className="relative w-40 h-12">
            <Image 
              src="/logo-white.png" 
              alt="Kashmir Aromatics" 
              fill 
              className="object-contain" 
            />
          </div>
          <p className="text-white/60 text-sm leading-relaxed">
            Pure, authentic aromatics sourced directly from the valleys of Kashmir. 
            Sustainable, organic, and crafted with care.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-white/60 hover:text-brand-gold transition"><Instagram size={20} /></a>
            <a href="#" className="text-white/60 hover:text-brand-gold transition"><Facebook size={20} /></a>
            <a href="#" className="text-white/60 hover:text-brand-gold transition"><Twitter size={20} /></a>
          </div>
        </div>

        {/* Column 2: Shop */}
        <div>
          <h4 className="font-sans font-bold text-xs tracking-[0.2em] text-brand-gold uppercase mb-6">Shop</h4>
          <ul className="space-y-4 text-sm text-white/60">
            <li><Link href="/shop/essential-oils" className="hover:text-white transition">Essential Oils</Link></li>
            <li><Link href="/shop/hydrosols" className="hover:text-white transition">Hydrosols</Link></li>
            <li><Link href="/shop/perfumes" className="hover:text-white transition">Perfumes</Link></li>
            <li><Link href="/shop/gift-sets" className="hover:text-white transition">Gift Sets</Link></li>
            <li><Link href="/track-order" className="hover:text-white transition">Track Order</Link></li>
          </ul>
        </div>

        {/* Column 3: Company */}
        <div>
          <h4 className="font-sans font-bold text-xs tracking-[0.2em] text-brand-gold uppercase mb-6">Company</h4>
          <ul className="space-y-4 text-sm text-white/60">
            <li><Link href="/about" className="hover:text-white transition">Our Story</Link></li>
            <li><Link href="/contact" className="hover:text-white transition">Contact Us</Link></li>
            <li><Link href="/shipping" className="hover:text-white transition">Shipping Policy</Link></li>
            <li><Link href="/returns" className="hover:text-white transition">Returns</Link></li>
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div>
          <h4 className="font-sans font-bold text-xs tracking-[0.2em] text-brand-gold uppercase mb-6">Newsletter</h4>
          <p className="text-white/60 text-sm mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
          <form className="flex flex-col gap-3">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-brand-gold transition"
            />
            <button className="bg-brand-gold text-brand-black px-4 py-3 text-sm font-bold uppercase tracking-widest hover:bg-white transition">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Copyright & Credits */}
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-white/40">
        <p>&copy; {new Date().getFullYear()} Kashmir Aromatics. All rights reserved.</p>
        
        <p>
          Designed by{' '}
          <a 
            href="https://www.linkedin.com/in/miradnanayoub" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white/60 hover:text-brand-gold transition-colors duration-200 underline underline-offset-4"
          >
            Adnan Mir
          </a>
        </p>
      </div>
    </footer>
  );
}