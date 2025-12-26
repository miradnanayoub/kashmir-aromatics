"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";
import { Loader2, CheckCircle, CreditCard, Banknote } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items, cartTotal } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod"); // Default to COD

  // Form State
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

    // 1. Prepare Data for API
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
        product_id: item.databaseId, // Ensure this maps correctly
        quantity: item.quantity,
      })),
    };

    try {
      // 2. Call our Next.js API Route
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await res.json();

      if (result.success) {
        toast.success(`Order #${result.orderId} Placed Successfully!`);
        // Clear cart (You might need a clearCart function in context later)
        // Redirect to a Thank You page
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

  return (
    <main className="min-h-screen bg-[#FAFAF9]">
      
      
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <h1 className="font-serif text-4xl text-brand-black mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* --- LEFT: SHIPPING FORM --- */}
          <div>
            <h2 className="text-xl font-serif mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-gold text-white text-xs flex items-center justify-center font-bold">1</span>
              Shipping Details
            </h2>

            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input required name="firstName" placeholder="First Name" onChange={handleInputChange} className="p-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-brand-gold w-full" />
                <input required name="lastName" placeholder="Last Name" onChange={handleInputChange} className="p-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-brand-gold w-full" />
              </div>
              <input required name="email" type="email" placeholder="Email Address" onChange={handleInputChange} className="p-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-brand-gold w-full" />
              <input required name="phone" type="tel" placeholder="Phone Number" onChange={handleInputChange} className="p-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-brand-gold w-full" />
              <input required name="address1" placeholder="Street Address" onChange={handleInputChange} className="p-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-brand-gold w-full" />
              <div className="grid grid-cols-2 gap-4">
                <input required name="city" placeholder="City" onChange={handleInputChange} className="p-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-brand-gold w-full" />
                <input required name="postcode" placeholder="Pincode" onChange={handleInputChange} className="p-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-brand-gold w-full" />
              </div>
              <input required name="state" placeholder="State" onChange={handleInputChange} className="p-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-brand-gold w-full" />
            </form>

            {/* --- PAYMENT METHOD --- */}
            <h2 className="text-xl font-serif mt-12 mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-gold text-white text-xs flex items-center justify-center font-bold">2</span>
              Payment Method
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                onClick={() => setPaymentMethod("cod")}
                className={`p-6 border rounded-xl cursor-pointer flex items-center gap-4 transition-all ${paymentMethod === 'cod' ? 'border-brand-gold bg-brand-gold/5' : 'border-gray-200'}`}
              >
                <Banknote className={`w-6 h-6 ${paymentMethod === 'cod' ? 'text-brand-gold' : 'text-gray-400'}`} />
                <span className="font-bold text-sm">Cash on Delivery</span>
              </div>

              {/* Placeholder for Online Payment - We will activate this next */}
              <div 
                className="p-6 border border-gray-200 rounded-xl cursor-not-allowed opacity-50 flex items-center gap-4"
                title="Coming Soon"
              >
                <CreditCard className="w-6 h-6 text-gray-400" />
                <span className="font-bold text-sm text-gray-400">Online (Coming Soon)</span>
              </div>
            </div>
          </div>

          {/* --- RIGHT: ORDER SUMMARY --- */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 h-fit shadow-sm">
            <h3 className="font-serif text-2xl mb-8">Order Summary</h3>
            
            <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden relative shrink-0">
                    <img src={item.image} alt={item.title} className="object-cover w-full h-full" />
                    <div className="absolute top-0 right-0 bg-brand-black text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-bl-lg">
                      {item.quantity}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-serif text-sm text-gray-900 line-clamp-1">{item.title}</h4>
                    <p className="text-xs text-gray-500">{item.category}</p>
                  </div>
                  <div className="font-bold text-sm">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-6 space-y-3 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>₹{cartTotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className="text-green-600 font-bold">Free</span>
              </div>
              <div className="flex justify-between text-xl font-serif text-brand-black pt-4 border-t border-gray-100 mt-4">
                <span>Total</span>
                <span>₹{cartTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-8 bg-[#1A1A1A] text-white h-14 rounded-full flex items-center justify-center gap-2 font-bold uppercase tracking-wider hover:bg-[#D4AF37] transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Confirm Order
                </>
              )}
            </button>
            
            <p className="text-center text-[10px] text-gray-400 mt-4">
              Secure Checkout encrypted by 256-bit SSL
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}