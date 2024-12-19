import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  api: {
    bodyParser: false,  // Disable the default body parser to allow Multer to handle the request
  },
};

export default nextConfig;
