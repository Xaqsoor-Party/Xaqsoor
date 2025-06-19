import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true, // disables incompatible image optimization
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xaqsoor.s3.eu-north-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
