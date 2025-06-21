import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true, // disables incompatible image optimization
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_IMAGE_HOSTNAME!,
        pathname: process.env.NEXT_PUBLIC_IMAGE_PATHNAME!,
      },
    ],
  },
};

export default nextConfig;
