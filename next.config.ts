import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "kashmiraromatics.in", // Allow your live site
      },
      {
        protocol: "https",
        hostname: "www.kashmiraromatics.in", // Allow www version just in case
      },
    ],
  },
};

export default nextConfig;