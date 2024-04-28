/** @type {import('next').NextConfig} */

// https://github.com/WalletConnect/walletconnect-monorepo/issues/1908#issuecomment-1487801131
const nextConfig = {
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
}

module.exports = nextConfig
