/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http", // 🛑 must match actual runtime protocol
        hostname: "edulmmersion.croncore.com",
        pathname: "/media/**",
      },
      {
        protocol: "https", // ✅ optional, in case you upgrade backend URLs later
        hostname: "edulmmersion.croncore.com",
        pathname: "/media/**",
      },
    ],
  },
};

module.exports = nextConfig;
