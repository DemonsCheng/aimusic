import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import mdx from "@next/mdx";

const nextConfig: NextConfig = {
  images: {
    domains: ["picsum.photos", "unsplash.com", "images.unsplash.com"],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },

  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },

  /* config options here */

  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const withMDX = mdx({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});
// Make sure experimental mdx flag is enabled
const configWithMDX = {
  ...nextConfig,
  experimental: {
    mdxRs: true,
  },
};

// Merge MDX config with Next.js config
export default withMDX(configWithMDX);
