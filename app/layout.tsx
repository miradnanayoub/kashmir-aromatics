import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext"; // Connects the Cart Logic
import CartDrawer from "@/components/CartDrawer";     // Connects the Sliding Sidebar
import Footer from "@/components/Footer";

// 1. Setup Montserrat (Body Text)
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600"],
});

// 2. Setup Playfair Display (Headings)
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Kashmir Aromatics | Valley's Aromatic Tale",
  description: "Authentic essential oils and hydrosols from the Kashmir Valley.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        suppressHydrationWarning={true}
        className={`${montserrat.variable} ${playfair.variable} antialiased bg-[#FAFAF9] text-[#1A1A1A]`}
      >
        {/* We wrap the whole app in CartProvider so the cart works on every page */}
        <CartProvider>
          {children}
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}