import Navbar from "@/components/Navbar";

export default function ContactPage() {
  return (
    <main className="bg-brand-cream min-h-screen">
      <Navbar />
      
      <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          
          {/* Left: Info */}
          <div>
            <span className="font-sans text-xs font-bold tracking-[0.3em] text-brand-gold uppercase mb-4 block">Get in Touch</span>
            <h1 className="font-serif text-5xl text-brand-black mb-8">We'd love to hear from you.</h1>
            <p className="text-gray-600 mb-10 leading-relaxed">
              Whether you have a question about our distillation process, need a recommendation, or just want to say hello, our team is here to help.
            </p>

            <div className="space-y-6 font-sans text-sm">
              <div>
                <h3 className="font-bold text-brand-black uppercase tracking-widest mb-2">Email</h3>
                <p className="text-gray-600">hello@kashmiraromatics.in</p>
              </div>
              <div>
                <h3 className="font-bold text-brand-black uppercase tracking-widest mb-2">Studio</h3>
                <p className="text-gray-600">
                  12 Saffron Lane, Pampore<br />
                  Jammu & Kashmir, India 192121
                </p>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white p-8 md:p-10 shadow-sm border border-gray-100">
            <form className="flex flex-col gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Name</label>
                <input type="text" className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-brand-gold transition" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email</label>
                <input type="email" className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-brand-gold transition" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Message</label>
                <textarea rows={4} className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-brand-gold transition"></textarea>
              </div>
              <button className="bg-brand-black text-white py-4 font-bold uppercase tracking-widest text-xs hover:bg-brand-gold transition-colors mt-4">
                Send Message
              </button>
            </form>
          </div>

        </div>
      </section>
    </main>
  );
}