/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
    // Le logo local /logo.jpeg est servi depuis public/ sans config supplémentaire
  },
  experimental: {
    serverComponentsExternalPackages: ['ws'],
  },
}

module.exports = nextConfig
