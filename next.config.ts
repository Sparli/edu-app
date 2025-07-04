/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "edulmmersion.croncore.com",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "edulmmersion.croncore.com",
        pathname: "/media/**",
      },
    ],
  },
};

module.exports = nextConfig;
