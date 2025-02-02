import('next').NextConfig
const nextConfig = {
  reactStrictMode: true,
};
// next.config.js

module.exports = {
  nextConfig,
  webpack: (config, { isServer }) => {
    // Only disable the `fs` module on the client-side
    if (!isServer) {
      config.resolve.fallback = {
        fs: false
      }
    }

    return config
  }
}
