const nextConfig = {
  images: {
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
