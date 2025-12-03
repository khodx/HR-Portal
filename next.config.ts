import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Enable Turbopack
  experimental: {
    turbo: {
      rules: {},
    },
  },

  // Allow images from Supabase storage
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
}

export default nextConfig;
