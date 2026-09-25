import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A separate local build directory avoids locks from synced Windows folders.
  // Vercel uses the default .next directory.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
