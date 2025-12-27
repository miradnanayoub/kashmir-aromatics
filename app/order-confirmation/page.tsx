"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { CheckCircle, Download, Home, Loader2, Mail, Info } from "lucide-react"; // Added Info icon
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import Link from "next/link";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const email = searchParams.get("email");
  const paymentMethodRaw = searchParams.get("paymentMethod");
  
  const [isDownloading, setIsDownloading] = useState(false);

  const displayPaymentMethod = paymentMethodRaw === "cod" 
    ? "Cash on Delivery" 
    : paymentMethodRaw === "razorpay" 
      ? "Online (Razorpay)" 
      : "Online Payment";

  const handleDownloadReceipt = async () => {
    const element = document.getElementById("order-receipt");
    if (!element) return;

    setIsDownloading(true);
    try {
      const dataUrl = await toPng(element, { 
        cacheBust: true, 
        backgroundColor: '#ffffff' 
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgProperties = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`KashmirAromatics-Order-${orderId}.pdf`);
      
    } catch (error) {
      console.error("Failed to generate PDF", error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!orderId) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-gold mb-4" />
        <p>Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
      
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="font-serif text-3xl md:text-4xl text-gray-900 mb-2">
          Thank you for your order!
        </h1>
        <p className="text-gray-500">
          Your order <span className="font-bold text-gray-900">#{orderId}</span> has been confirmed.
        </p>
      </div>

      {/* --- THE RECEIPT --- */}
      <div 
        id="order-receipt" 
        className="bg-white p-8 md:p-12 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 mb-10 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-brand-gold/20" />
        
        <div className="flex justify-between items-start mb-8 border-b border-dashed border-gray-200 pb-8">
          <div>
            <h2 className="font-serif text-2xl text-brand-black mb-1">Receipt</h2>
            <p className="text-xs text-gray-400 uppercase tracking-widest">Kashmir Aromatics</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Order Date</p>
            <p className="font-bold text-gray-900">{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-y-6 gap-x-12 mb-8 text-sm">
          <div>
            <p className="text-gray-500 mb-1">Order Number</p>
            <p className="font-bold text-gray-900">#{orderId}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Payment Method</p>
            <p className="font-bold text-gray-900 capitalize">{displayPaymentMethod}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Shipping Status</p>
            <p className="font-bold text-green-600">Processing</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Expected Delivery</p>
            <p className="font-bold text-gray-900">5-7 Business Days</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center text-center gap-2 mb-8 border border-gray-100">
          <Mail className="w-5 h-5 text-brand-gold" />
          <p className="text-gray-600 text-sm">
            A detailed receipt and order confirmation has been emailed to:
          </p>
          <p className="font-bold text-gray-900 text-base break-all">
            {email || "your registered email"}
          </p>
        </div>

        <div className="flex justify-center">
          <p className="font-serif text-sm text-gray-400 italic">
            Thank you for shopping from Kashmir Aromatics
          </p>
        </div>
      </div>

      {/* --- NEW: Tracking Tip Message --- */}
      <div className="text-center mb-6 max-w-lg mx-auto">
        <p className="text-sm text-gray-600 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 flex items-center justify-center gap-2">
          <Info className="w-4 h-4 text-brand-gold shrink-0" />
          <span>
            <strong>Tip:</strong> Keeping a copy of this receipt will help you track your order using the <strong>Order ID</strong>.
          </span>
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleDownloadReceipt}
          disabled={isDownloading}
          className="flex items-center justify-center gap-2 bg-brand-black text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-brand-gold transition-all shadow-lg disabled:opacity-70"
        >
          {isDownloading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {isDownloading ? "Generating..." : "Download Receipt"}
        </button>

        <Link 
          href="/"
          className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-900 px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-gray-50 transition-all"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF9]">
      <Navbar />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
        </div>
      }>
        <OrderConfirmationContent />
      </Suspense>
    </main>
  );
}