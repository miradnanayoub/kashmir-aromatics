"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);
    
    // Add your Web3Forms Access Key here
    formData.append("access_key", "c586fe6d-75ca-4dff-99cf-74ca8aebc16e"); 

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        setIsSuccess(true);
        event.currentTarget.reset(); // Clear the form
      } else {
        setErrorMessage(result.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Network error. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="bg-[#FAFAF9] min-h-screen">
      <Navbar />
      
      <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          
          {/* Left: Info */}
          <div>
            <span className="font-sans text-xs font-bold tracking-[0.3em] text-amber-600 uppercase mb-4 block">Get in Touch</span>
            <h1 className="font-serif text-5xl text-gray-900 mb-8">We'd love to hear from you.</h1>
            <p className="text-gray-600 mb-10 leading-relaxed">
              Whether you have a question about our distillation process, need a recommendation, or just want to say hello, our team is here to help.
            </p>

            <div className="space-y-6 font-sans text-sm">
              <div>
                <h3 className="font-bold text-gray-900 uppercase tracking-widest mb-2">Email</h3>
                <p className="text-gray-600">hello@kashmiraromatics.in</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 uppercase tracking-widest mb-2">Studio</h3>
                <p className="text-gray-600">
                  12 Saffron Lane, Pampore<br />
                  Jammu & Kashmir, India 192121
                </p>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white p-8 md:p-10 shadow-sm border border-gray-100 rounded-lg">
            {isSuccess ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10 animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-serif text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-500 mb-6">Thank you for reaching out. We will get back to you shortly.</p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="text-amber-600 font-bold text-sm uppercase tracking-wider hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Hidden Bot Protection */}
                <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    required 
                    className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-amber-600 transition bg-transparent" 
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    required 
                    className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-amber-600 transition bg-transparent" 
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Message</label>
                  <textarea 
                    name="message" 
                    required 
                    rows={4} 
                    className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-amber-600 transition bg-transparent resize-none"
                    placeholder="How can we help?"
                  ></textarea>
                </div>

                {errorMessage && (
                  <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded">
                    <AlertCircle className="w-4 h-4" />
                    {errorMessage}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-gray-900 text-white py-4 font-bold uppercase tracking-widest text-xs hover:bg-amber-600 transition-colors mt-4 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </section>
    </main>
  );
}