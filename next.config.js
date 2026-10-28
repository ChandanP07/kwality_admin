/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],

  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    // Added googleusercontent.com so Google profile pictures render
    domains: ['localhost', 'lh3.googleusercontent.com'],
  },

  async headers() {
    // CLIENT_APP_URL is the origin of the client Next.js app
    // e.g. http://localhost:3000 when running locally
    const clientOrigin = process.env.CLIENT_APP_URL || 'http://localhost:3000'

    return [
      // ── CORS — allow client app to call admin's /api/client/* routes ──
      {
        source: '/api/client/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: clientOrigin },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PATCH,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
        ],
      },
      // ── CORS — allow client app to reach NextAuth endpoints ──
      {
        source: '/api/auth/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: clientOrigin },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
        ],
      },
      {
        source: '/api/cities/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: clientOrigin },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
        ],
      },

      // ── Security headers for all other routes ──
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          {
            key: 'Content-Security-Policy',
            // Added accounts.google.com for OAuth redirect
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: localhost lh3.googleusercontent.com",
              "font-src 'self' data:",
              `connect-src 'self' ${clientOrigin} accounts.google.com`,
              "frame-src accounts.google.com",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
