"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { ChevronDown, ChevronUp, ShieldCheck, Truck, FileText, RefreshCw } from "lucide-react";

// --- POLICY CONTENT DATA (Sourced from kashmiraromatics.in) ---
const POLICIES = [
  {
    id: "privacy",
    title: "Privacy Policy",
    icon: <ShieldCheck className="w-5 h-5" />,
    content: `
      <p class="mb-4">At Kashmir Aromatics, we are committed to protecting the privacy of our customers and users. This privacy policy outlines the types of personal information we collect and how we use, disclose, and protect that information.</p>
      
      <h4 class="font-bold mb-2">1. Information Collection and Use</h4>
      <p class="mb-4">We collect personal information from our users in a variety of ways, including when users place an order, create an account, subscribe to our newsletter, or participate in a survey or promotion. The types of personal information we may collect include name, email address, mailing address and phone number.</p>
      <p class="mb-4">We use this information to process and fulfil orders, create and manage user accounts, send marketing and promotional materials, and to improve our website and services. We may also use this information to respond to customer inquiries, troubleshoot problems, and to enforce our terms of use.</p>
      
      <h4 class="font-bold mb-2">2. Disclosure of Personal Information</h4>
      <p class="mb-4">We do not sell or rent personal information to third parties. We may share personal information with third parties who perform services on our behalf, such as processing payments, fulfilling orders, or providing customer service. These third parties are contractually obligated to keep personal information confidential and to use it only for the purpose of providing the services for which they were engaged.</p>
      <p class="mb-4">We may also disclose personal information in response to legal process, such as a court order or subpoena, or to protect the rights, property, or safety of our company, our customers, or others.</p>
      
      <h4 class="font-bold mb-2">3. Security of Personal Information</h4>
      <p class="mb-4">We take reasonable steps to protect personal information from loss, misuse, and unauthorized access, disclosure, alteration, and destruction. However, no method of transmission over the internet, or method of electronic storage, is 100% secure. Therefore, while we strive to use commercially acceptable means to protect personal information, we cannot guarantee its absolute security.</p>
      
      <h4 class="font-bold mb-2">4. Changes to this Privacy Policy</h4>
      <p class="mb-4">We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on our website. You are advised to review this privacy policy periodically for any changes.</p>
    `
  },
  {
    id: "shipping",
    title: "Shipping Policy",
    icon: <Truck className="w-5 h-5" />,
    content: `
      <p class="mb-4">Thank you for choosing Kashmir Aromatics! Below is our Shipping Policy to provide you with all the necessary information about our shipping procedures within India.</p>
      
      <h4 class="font-bold mb-2">1. Shipping Zones</h4>
      <p class="mb-4">Kashmir Aromatics currently ships orders only within India. We do not offer international shipping at this time.</p>
      
      <h4 class="font-bold mb-2">2. Order Processing Time</h4>
      <p class="mb-4">After receiving your order and verifying the payment, we strive to process and dispatch your package within 3 business days. Please note that order processing time may be slightly longer during peak seasons or special promotions.</p>
      
      <h4 class="font-bold mb-2">3. Delivery Time</h4>
      <p class="mb-4">The estimated delivery time for your order will depend on the shipping address and the courier partner. Generally, orders are delivered within 5-10 business days from the date of dispatch.</p>
      <p class="mb-4">Please note that unforeseen circumstances such as weather conditions, public holidays, or other logistics issues may cause delays in delivery.</p>
      
      <h4 class="font-bold mb-2">4. Shipping Charges</h4>
      <p class="mb-4">Shipping charges will be calculated based on the weight of the products in your order, as well as the delivery address provided during checkout. The shipping cost will be displayed at the time of checkout for your review.</p>
      
      <h4 class="font-bold mb-2">5. Order Tracking</h4>
      <p class="mb-4">After your order is dispatched, we will provide you with a tracking number via email or SMS. You can use this tracking number to monitor the status of your package.</p>
    `
  },
  {
    id: "refunds",
    title: "Refunds and Cancellations",
    icon: <RefreshCw className="w-5 h-5" />,
    content: `
      <p class="mb-4">We value your trust and satisfaction. If you are not happy with your purchase, you may return it or exchange it in accordance with the terms and conditions of this policy.</p>
      
      <h4 class="font-bold mb-2">1. Returns</h4>
      <p class="mb-4">You have 7 calendar days to return an item from the date you received it. To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.</p>
      <p class="mb-4">Please do not send your purchase back to the manufacturer. Contact us first to obtain a Return Merchandise Authorization (RMA) number.</p>
      
      <h4 class="font-bold mb-2">2. Refunds</h4>
      <p class="mb-4">Once we receive your item, we will inspect it and notify you of the status of your refund. If your return is approved, we will initiate a refund to your original method of payment.</p>
      
      <h4 class="font-bold mb-2">3. Cancellations</h4>
      <p class="mb-4">You can cancel your order within 24 hours of placing it, or before it is shipped, whichever is earlier. To cancel your order, please contact us by email or phone.</p>
      
      <h4 class="font-bold mb-2">4. Exchanges</h4>
      <p class="mb-4">We only replace items if they are defective or damaged. If you need to exchange an item for the same item, please contact us to obtain an RMA number.</p>
      
      <h4 class="font-bold mb-2">5. Return Shipping</h4>
      <p class="mb-4">You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable.</p>
    `
  },
  {
    id: "terms",
    title: "Terms and Conditions",
    icon: <FileText className="w-5 h-5" />,
    content: `
      <p class="mb-4">Welcome to Kashmir Aromatics. By accessing this website, you agree to comply with and be bound by the following terms and conditions.</p>
      
      <h4 class="font-bold mb-2">1. Intellectual Property</h4>
      <p class="mb-4">The content, layout, design, data, and graphics on this website are protected by Indian and other international copyright laws. Content is solely owned by Kashmir Aromatics.</p>
      
      <h4 class="font-bold mb-2">2. Product Descriptions</h4>
      <p class="mb-4">We attempt to be as accurate as possible. However, we do not warrant that product descriptions or other content of this site is accurate, complete, reliable, current, or error-free.</p>
      
      <h4 class="font-bold mb-2">3. Limitation of Liability</h4>
      <p class="mb-4">Kashmir Aromatics shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the website or our products.</p>
    `
  }
];

export default function PoliciesPage() {
  const [openSection, setOpenSection] = useState<string | null>("privacy");

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <main className="min-h-screen bg-[#FAFAF9]">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="font-serif text-3xl md:text-5xl text-gray-900">
            Store Policies
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Transparency is key to our relationship with you. Please read our policies below to understand how we operate and serve you better.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {POLICIES.map((policy) => (
            <div 
              key={policy.id} 
              className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                openSection === policy.id 
                  ? "border-brand-gold shadow-lg shadow-brand-gold/5" 
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <button
                onClick={() => toggleSection(policy.id)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full transition-colors ${
                    openSection === policy.id ? "bg-brand-gold text-white" : "bg-gray-100 text-gray-500"
                  }`}>
                    {policy.icon}
                  </div>
                  <span className={`font-serif text-lg md:text-xl font-medium ${
                    openSection === policy.id ? "text-brand-black" : "text-gray-700"
                  }`}>
                    {policy.title}
                  </span>
                </div>
                
                {openSection === policy.id ? (
                  <ChevronUp className="w-5 h-5 text-brand-gold" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {/* Expandable Content */}
              <div 
                className={`transition-all duration-300 ease-in-out ${
                  openSection === policy.id ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-8 pl-[4.5rem] prose prose-stone prose-sm md:prose-base text-gray-600 max-w-none">
                  {/* We render HTML securely since it's our own static content */}
                  <div dangerouslySetInnerHTML={{ __html: policy.content }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Footer */}
        <div className="mt-16 text-center pt-10 border-t border-dashed border-gray-200">
          <p className="text-gray-500 text-sm">
            Have more questions? Reach out to us at <br />
            <a href="mailto:ufkashmiraromatics@gmail.com" className="text-brand-black font-bold hover:text-brand-gold transition-colors">
              ufkashmiraromatics@gmail.com
            </a>
          </p>
        </div>

      </div>
    </main>
  );
}