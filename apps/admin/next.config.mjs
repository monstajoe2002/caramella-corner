import { dotenvLoad } from "dotenv-mono";
dotenvLoad();

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@caramella-corner/ui"],
  serverExternalPackages: ["mongoose"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: "",
      },
    ],
  },
};

export default nextConfig;
