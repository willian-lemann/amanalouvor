import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { hostname: "static.wixstatic.com" },
      { hostname: "cpyvvzkslcscyoftatqs.supabase.co" },
    ],
  },
};

export default nextConfig;
