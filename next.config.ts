import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    domains: ["picsum.photos", "unsplash.com", "images.unsplash.com"],
  },
  /* config options here */
};

export default nextConfig;
