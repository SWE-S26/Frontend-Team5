import type { NextConfig } from "next";

const isDev = process.env.NEXT_PUBLIC_ENV === "development"

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  ...(isDev && {
    async rewrites() {
      return [
        {
          source: "/api/:path*",
          destination: `https://beatza.me/api/:path*`,
        },
      ]
    },
  }),
};

export default nextConfig;