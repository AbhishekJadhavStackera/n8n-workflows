/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, PATCH, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization, X-N8N-API-KEY' },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        // Proxy n8n editor for iframe embedding
        source: '/n8n/:path*',
        destination: `${process.env.NEXT_PUBLIC_N8N_HOST || 'http://localhost:5678'}/:path*`,
      },
    ];
  },
  webpack: (config) => {
    config.externals = config.externals || [];
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    });

    return config;
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
