import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // 🌟 CRUCIAL: Generates the flat static "out" directory for mobile packaging
  images: {
    unoptimized: true, // Required for static web view exports
  },
};

export default nextConfig;