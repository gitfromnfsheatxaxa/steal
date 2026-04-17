/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "34.56.67.158",
        port: "8090",
      },
    ],
  },
  // Proxy /pb/* → PocketBase so the browser never makes cross-origin HTTP
  // requests. This solves mixed-content (HTTPS Vercel → HTTP PocketBase).
  async rewrites() {
    const dest = process.env.POCKETBASE_INTERNAL_URL || "http://34.56.67.158:8090";
    return [
      {
        source: "/pb/:path*",
        destination: `${dest}/:path*`,
      },
    ];
  },
};

export default nextConfig;
