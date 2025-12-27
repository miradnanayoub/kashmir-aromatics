"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";
import { Loader2, CheckCircle, CreditCard, Banknote, ShieldCheck, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CheckoutPage() {
  const { items, cartTotal } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address1: "",
    city: "",
    state: "",
    postcode: "",
    email: "",
    phone: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (items.length === 0) {
      toast.error("Your cart is empty");
      setLoading(false);
      return;
    }

    const orderData = {
      payment_method: paymentMethod,
      billing: {
        first_name: formData.firstName,
        last_name: formData.lastName,
        address_1: formData.address1,
        city: formData.city,
        state: formData.state,
        postcode: formData.postcode,
        email: formData.email,
        phone: formData.phone,
        country: "IN",
      },
      line_items: items.map((item) => ({
        product_id: item.databaseId,
        quantity: item.quantity,
      })),
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await res.json();

      if (result.success) {
        toast.success(`Order #${result.orderId} Placed!`);
        router.push(`/order-confirmation?orderId=${result.orderId}`);
      } else {
        toast.error("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Reusable Input Component for consistent style
  const InputField = ({ name, label, type = "text", required = true, className = "" }: any) => (
    <div className={`relative ${className}`}>
      <input
        required={required}
        type={type}
        name={name}
        id={name}
        placeholder=" "
        onChange={handleInputChange}
        className="peer w-full px-4 pt-6 pb-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition-all placeholder-transparent"
      />
      <label
        htmlFor={name}
        className="absolute left-4 top-2 text-[10px] uppercase tracking-wider font-bold text-gray-400 transition-all 
                   peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case
                   peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-brand-gold peer-focus:font-bold peer-focus:uppercase"
      >
        {label}
      </label>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#FAFAF9]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 border-b border-gray-200 pb-6">
          <h1 className="font-serif text-3xl md:text-4xl text-gray-900">Checkout</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-2 md:mt-0">
            <Lock className="w-4 h-4" />
            <span>Secure 256-bit SSL Encrypted</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* --- LEFT: FORMS (Shipping & Payment) --- */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Step 1: Shipping */}
            <section>
              <h2 className="text-xl font-serif mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-brand-black text-white text-sm flex items-center justify-center font-bold">1</span>
                Shipping Details
              </h2>

              <form id="checkout-form" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField name="firstName" label="First Name" />
                <InputField name="lastName" label="Last Name" />
                
                <InputField name="email" label="Email Address" type="email" className="md:col-span-2" />
                <InputField name="phone" label="Phone Number" type="tel" className="md:col-span-2" />
                
                <InputField name="address1" label="Street Address" className="md:col-span-2" />
                
                <InputField name="city" label="City" />
                <InputField name="postcode" label="Pincode" />
                
                <InputField name="state" label="State" className="md:col-span-2" />
              </form>
            </section>

            {/* Step 2: Payment */}
            <section>
              <h2 className="text-xl font-serif mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-brand-black text-white text-sm flex items-center justify-center font-bold">2</span>
                Payment Method
              </h2>
              
              <div className="grid grid-cols-1 gap-4">
                <div 
                  onClick={() => setPaymentMethod("cod")}
                  className={`relative p-6 border rounded-2xl cursor-pointer flex items-center gap-5 transition-all duration-200 ${
                    paymentMethod === 'cod' 
                      ? 'border-brand-gold bg-amber-50/30 ring-1 ring-brand-gold/20 shadow-sm' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-brand-gold' : 'border-gray-300'}`}>
                    {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-brand-gold" />}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Banknote className="w-5 h-5 text-gray-700" />
                      <span className="font-bold text-gray-900">Cash on Delivery</span>
                    </div>
                    <p className="text-sm text-gray-500">Pay securely when your order arrives.</p>
                  </div>
                </div>

                <div className="relative p-6 border border-gray-100 rounded-2xl flex items-center gap-5 opacity-60 cursor-not-allowed bg-gray-50">
                   <div className="w-5 h-5 rounded-full border-2 border-gray-200" />
                   <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CreditCard className="w-5 h-5 text-gray-400" />
                      <span className="font-bold text-gray-400">Online Payment</span>
                    </div>
                    <p className="text-sm text-gray-400">Temporarily unavailable.</p>
                  </div>
                  <span className="absolute top-4 right-4 text-[10px] uppercase font-bold tracking-widest bg-gray-200 text-gray-500 px-2 py-1 rounded">Soon</span>
                </div>
              </div>
            </section>

          </div>

          {/* --- RIGHT: ORDER SUMMARY (Sticky) --- */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40">
              <h3 className="font-serif text-2xl mb-6">Order Summary</h3>
              
              {/* Product List */}
              <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center group">
                    <div className="relative w-16 h-16 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                      <Image 
                        src={item.image} 
                        alt={item.title} 
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-0 right-0 bg-brand-black/90 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-bl-lg font-bold">
                        {item.quantity}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-sm text-gray-900 truncate pr-2">{item.title}</h4>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">{item.category}</p>
                    </div>
                    
                    <div className="font-bold text-sm whitespace-nowrap">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-dashed border-gray-200 pt-6 space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Free
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-4 border-t border-gray-200 mt-4">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <div className="text-right">
                    <span className="block text-2xl font-serif text-brand-black">₹{cartTotal.toLocaleString("en-IN")}</span>
                    <span className="text-[10px] text-gray-400">Including Taxes</span>
                  </div>
                </div>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full mt-8 bg-brand-black text-white h-14 rounded-full flex items-center justify-center gap-3 font-bold uppercase tracking-wider text-sm hover:bg-brand-gold hover:text-white transition-all duration-300 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Place Order
                  </>
                )}
              </button>
              
              <div className="mt-6 flex justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                 {/* You can add payment icons here later */}
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}