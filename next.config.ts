/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: false,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
