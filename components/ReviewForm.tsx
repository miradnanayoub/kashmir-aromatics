"use client";

import { useState } from 'react';
import { Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReviewForm({ productId }: { productId: number }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    comment: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          reviewer: formData.name,
          email: formData.email,
          rating,
          content: formData.comment
        })
      });

      if (!res.ok) throw new Error('Failed to submit');

      toast.success("Review submitted for approval!");
      // Reset form
      setFormData({ name: '', email: '', comment: '' });
      setRating(0);
      
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm mt-12 max-w-2xl">
      <h3 className="text-xl font-serif font-bold text-gray-900 mb-6">Write a Review</h3>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Rating Stars */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none transition-transform hover:scale-110"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(rating)}
              >
                <Star 
                  size={24} 
                  className={`${
                    star <= (hover || rating) 
                      ? "fill-brand-gold text-brand-gold" 
                      : "text-gray-300"
                  } transition-colors duration-200`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition-all"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition-all"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Review</label>
          <textarea 
            required
            rows={4}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition-all resize-none"
            placeholder="Share your experience with this product..."
            value={formData.comment}
            onChange={(e) => setFormData({...formData, comment: e.target.value})}
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-black text-white px-8 py-3 rounded-full font-medium text-sm hover:bg-brand-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}