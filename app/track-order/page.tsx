"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";
import { Loader2, Package, CheckCircle, Clock, Truck, XCircle } from "lucide-react";

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

  // Helper to get status icon/color
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed': return { icon: <CheckCircle className="w-8 h-8 text-green-500" />, color: "bg-green-50 text-green-700", text: "Completed" };
      case 'processing': return { icon: <Loader2 className="w-8 h-8 text-blue-500 animate-spin-slow" />, color: "bg-blue-50 text-blue-700", text: "Processing" };
      case 'on-hold': return { icon: <Clock className="w-8 h-8 text-amber-500" />, color: "bg-amber-50 text-amber-700", text: "On Hold" };
      case 'cancelled': return { icon: <XCircle className="w-8 h-8 text-red-500" />, color: "bg-red-50 text-red-700", text: "Cancelled" };
      default: return { icon: <Package className="w-8 h-8 text-gray-500" />, color: "bg-gray-50 text-gray-700", text: status };
    }
  };

  return (
    <main className="bg-[#FAFAF9] min-h-screen">
      <Navbar />

      <section className="pt-40 pb-20 px-6 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="font-sans text-xs font-bold tracking-[0.3em] text-amber-600 uppercase mb-3 block">Order Status</span>
          <h1 className="font-serif text-4xl text-gray-900">Track Your Order</h1>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
          <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Order ID</label>
              <input 
                name="orderId" 
                type="text" 
                placeholder="e.g. 1502" 
                required
                className="w-full border border-gray-200 rounded p-3 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Billing Email</label>
              <input 
                name="email" 
                type="email" 
                placeholder="email@example.com" 
                required
                className="w-full border border-gray-200 rounded p-3 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition"
              />
            </div>
            <div className="flex items-end">
              <button 
                type="submit" 
                disabled={isLoading}
                className="h-[50px] px-8 bg-gray-900 text-white font-bold uppercase tracking-widest text-xs rounded hover:bg-amber-600 transition-colors disabled:opacity-70 flex items-center justify-center w-full md:w-auto"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Track"}
              </button>
            </div>
          </form>

          {/* --- RESULTS AREA --- */}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded text-center text-sm border border-red-100">
              {error}
            </div>
          )}

          {orderData && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className={`p-6 rounded-lg border border-gray-100 flex items-center gap-4 mb-6 ${getStatusStyle(orderData.status).color}`}>
                {getStatusStyle(orderData.status).icon}
                <div>
                  <h3 className="font-serif text-xl font-medium capitalize">{getStatusStyle(orderData.status).text}</h3>
                  <p className="text-xs opacity-80 uppercase tracking-wider mt-1">Order #{orderData.id}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-4">Order Items</h4>
                <ul className="space-y-4">
                  {orderData.items.map((item: any, i: number) => (
                    <li key={i} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        <span className="font-medium text-gray-900">{item.quantity}x</span> {item.name}
                      </span>
                      <span className="font-medium text-gray-900">
                        {/* Assuming currency symbol is in the data, simpler display here */}
                        Wait for total
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-serif text-xl text-amber-600 font-medium">
                     {/* Try to parse currency symbol if available, else standard */}
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