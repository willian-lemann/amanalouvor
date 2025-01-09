import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        "https://amanalouvor.vercel.app",
        "http://localhost:3000",
      ],
      bodySizeLimit: "2mb",
    },
  },
  images: {
    remotePatterns: [
      { hostname: "static.wixstatic.com" },
      { hostname: "cpyvvzkslcscyoftatqs.supabase.co" },
    ],
  },
};

export default nextConfig;
