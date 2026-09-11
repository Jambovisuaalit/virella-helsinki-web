import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.virellahelsinki.com" }],
        destination: "https://virellahelsinki.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
