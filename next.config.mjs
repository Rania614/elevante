/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      // KYC uploads: 3 images, each limited to 5 MB in lib/storage.ts
      bodySizeLimit: "16mb",
    },
  },
}

export default nextConfig
