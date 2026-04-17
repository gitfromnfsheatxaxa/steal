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
};

export default nextConfig;
