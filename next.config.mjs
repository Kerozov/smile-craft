/** @type {import('next').NextConfig} */
const nextConfig = {
  // three.js и drei се зареждат само в браузъра (dynamic import, ssr: false)
  transpilePackages: ["three"],
  experimental: {
    optimizePackageImports: ["lucide-react", "@react-three/drei"],
  },
};

export default nextConfig;
