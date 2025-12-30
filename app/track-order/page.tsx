"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";
import { Loader2, Package, CheckCircle, Clock, Truck, XCircle, Search } from "lucide-react";

export default function TrackOrderPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [error, setError] = useState("");

  async function handleTrack(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setOrderData(null);

    const formData = new FormData(e.currentTarget);
    const orderId = formData.get("orderId");
    const email = formData.get("email");

    try {
      const res = await fetch("/api/track-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, email }),
      });

      const data = await res.json();

      if (data.success) {
        setOrderData(data.order);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Something went wrong. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  }

  // Helper to get status icon/color matching your brand theme
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed': 
        return { 
          icon: <CheckCircle className="w-6 h-6 text-green-600" />, 
          bg: "bg-green-50 border-green-100", 
          textClass: "text-green-800",
          label: "Delivered" 
        };
      case 'processing': 
        return { 
          icon: <Loader2 className="w-6 h-6 text-brand-gold animate-spin-slow" />, 
          bg: "bg-amber-50 border-amber-100", 
          textClass: "text-amber-800",
          label: "Processing" 
        };
      case 'on-hold': 
        return { 
          icon: <Clock className="w-6 h-6 text-orange-500" />, 
          bg: "bg-orange-50 border-orange-100", 
          textClass: "text-orange-800",
          label: "On Hold" 
        };
      case 'cancelled': 
        return { 
          icon: <XCircle className="w-6 h-6 text-red-500" />, 
          bg: "bg-red-50 border-red-100", 
          textClass: "text-red-800",
          label: "Cancelled" 
        };
      default: 
        return { 
          icon: <Package className="w-6 h-6 text-gray-500" />, 
          bg: "bg-gray-50 border-gray-100", 
          textClass: "text-gray-800",
          label: status 
        };
    }
  };

  return (
    <main className="bg-[#FAFAF9] min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="font-sans text-xs font-bold tracking-[0.3em] text-brand-gold uppercase mb-3 block">
            Order Status
          </span>
          <h1 className="font-serif text-3xl md:text-5xl text-gray-900">
            Track Your Order
          </h1>
          <p className="text-gray-500 mt-4 text-sm max-w-lg mx-auto">
            Enter your Order ID and Email to see the current status of your shipment.
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100">
          
          <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-6 mb-10">
            <div className="flex-1 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Order ID</label>
              <input 
                name="orderId" 
                type="text" 
                placeholder="e.g. 1502" 
                required
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition-all"
              />
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Billing Email</label>
              <input 
                name="email" 
                type="email" 
                placeholder="email@example.com" 
                required
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition-all"
              />
            </div>
            <div className="flex items-end">
              <button 
                type="submit" 
                disabled={isLoading}
                className="h-[58px] px-8 bg-brand-black text-white font-bold uppercase tracking-wider text-xs rounded-full hover:bg-brand-gold transition-all shadow-lg hover:shadow-brand-gold/20 disabled:opacity-70 flex items-center justify-center gap-2 w-full md:w-auto"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Track</span>
                    <Search className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* --- RESULTS AREA --- */}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center text-sm border border-red-100 flex items-center justify-center gap-2 animate-fade-in-up">
              <XCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {orderData && (
            <div className="animate-fade-in-up">
              
              {/* Status Banner */}
              <div className={`p-6 rounded-2xl border flex items-center gap-5 mb-8 ${getStatusStyle(orderData.status).bg}`}>
                <div className="p-3 bg-white rounded-full shadow-sm">
                  {getStatusStyle(orderData.status).icon}
                </div>
                <div>
                  <h3 className={`font-serif text-xl font-bold capitalize ${getStatusStyle(orderData.status).textClass}`}>
                    {getStatusStyle(orderData.status).label}
                  </h3>
                  <p className={`text-xs opacity-80 uppercase tracking-wider mt-1 ${getStatusStyle(orderData.status).textClass}`}>
                    Order #{orderData.id}
                  </p>
                </div>
              </div>

              {/* Order Details */}
              <div className="border-t border-dashed border-gray-200 pt-8">
                <h4 className="font-serif text-lg text-gray-900 mb-6 flex items-center gap-2">
                  <Package className="w-5 h-5 text-gray-400" />
                  Order Summary
                </h4>
                
                <ul className="space-y-4 mb-6">
                  {orderData.items.map((item: any, i: number) => (
                    <li key={i} className="flex justify-between items-start text-sm py-2 border-b border-gray-50 last:border-0">
                      <div className="flex-1 pr-4">
                        <span className="font-bold text-brand-black mr-2">{item.quantity}x</span>
                        <span className="text-gray-600">{item.name}</span>
                      </div>
                      <span className="font-medium text-gray-900 whitespace-nowrap">
                         {/* FIX: Display actual item total instead of "Wait for total" */}
                         {item.total ? `₹${item.total}` : ''}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="bg-gray-50 rounded-xl p-6 flex justify-between items-center border border-gray-100">
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Total Amount</span>
                  <span className="font-serif text-2xl text-brand-black">
                     ₹{orderData.total}
                  </span>
                </div>
              </div>

            </div>
          )}
        </div>
      </section>
    </main>
  );
}