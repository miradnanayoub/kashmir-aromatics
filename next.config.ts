/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'kashmiraromatics.in', // Allows images from your WordPress
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com', // Useful for testing
      },
    ],
  },
};

export default nextConfig;