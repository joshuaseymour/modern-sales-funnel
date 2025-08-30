/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configure page extensions to include TypeScript and JavaScript files
  pageExtensions: ['tsx', 'ts', 'jsx', 'js', 'mjs'],
  // Configure images
  images: {
    domains: ['localhost'],
  },
  // Enable React 19 and modern features
  experimental: {
    reactCompiler: true,
  },
  // Turbopack configuration for Next.js 15.5+
  turbopack: {},
  // Production security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Security headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          // Content Security Policy for secure payments
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com; connect-src 'self' https://api.stripe.com; frame-src https://js.stripe.com https://hooks.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self';"
          }
        ],
      },
    ];
  },
};

module.exports = nextConfig;
