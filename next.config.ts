import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/admission/:path*',
        destination: 'http://127.0.0.1:8000/api/admission/:path*',
      },
      {
        source: '/api/agent/:path*',
        destination: 'http://127.0.0.1:8000/api/agent/:path*',
      },
      {
        source: '/api/admin/:path*',
        destination: 'http://127.0.0.1:8000/api/admin/:path*',
      },
    ];
  },
};

export default nextConfig;
