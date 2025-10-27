/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "iad.microlink.io",
      },
    ],
  },
};

export default nextConfig;
