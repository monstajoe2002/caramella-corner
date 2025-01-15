/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@caramella-corner/ui"],
  serverExternalPackages: ["mongoose"],
};

export default nextConfig;
