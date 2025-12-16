export const products = [
  {
    id: "1",
    title: "Kashmiri Rose Oil",
    category: "Essential Oils",
    price: 1500,
    description: "Extracted from the Damask roses of the Kashmir valley, this pure essential oil captures the soulful essence of nature. Known for its calming properties and exquisite aroma, it is a timeless addition to your wellness routine.",
    images: [
      "https://images.unsplash.com/photo-1596434458928-8608e57973c4?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1615485925763-867862f80d53?q=80&w=2000&auto=format&fit=crop", // Placeholder 2
    ],
    details: {
      origin: "Pulwama, Kashmir",
      grade: "Therapeutic Grade",
      method: "Steam Distillation"
    }
  },
  {
    id: "2",
    title: "Lavender Breeze",
    category: "Aromatic Blends",
    price: 300,
    description: "A soothing blend of high-altitude lavender and subtle citrus notes. Perfect for diffusers or a relaxing evening massage.",
    images: [
      "https://images.unsplash.com/photo-1563200155-24231b53805f?q=80&w=2000&auto=format&fit=crop",
    ],
    details: {
      origin: "Pahalgam, Kashmir",
      grade: "Aromatic Blend",
      method: "Cold Press & Distillation"
    }
  },
  // Add more mock products as needed to match FeaturedCollection
];

export function getProductById(id: string) {
  return products.find((product) => product.id === id);
}