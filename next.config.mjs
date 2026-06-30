/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin the tracing root to this project (a parent lockfile exists on the machine).
  outputFileTracingRoot: import.meta.dirname,
  experimental: {
    staleTimes: {
      dynamic: 300,
      static: 600,
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
