import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['ui-avatars.com'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
        //hostname: 'via.placeholder.com',
        //hostname: '**', // Cho phép tất cả các host
        pathname: '**',

        //hostname: 'th.bing.com',
      },
    ],
  },
};

export default nextConfig;
