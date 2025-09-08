// @ts-ignore - next-pwa has no types
import withPWA from "next-pwa";
import path from "path";

const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  reactStrictMode: true,
  // Monorepo: evita warning de múltiplos lockfiles
  outputFileTracingRoot: path.join(__dirname, "../../"),
  // Build em CI mesmo com lint/TS
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
} as const;

export default withPWA({
  dest: "public",
  disable: !isProd,
  register: true,
  skipWaiting: true,
  runtimeCaching: [],
})(nextConfig);
