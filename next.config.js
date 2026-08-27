/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/site-data',
        destination: `${process.env.DISCORD_API_SERVER_URL || 'http://localhost:3001'}/api/site-data`,
      },
    ];
  },
};

module.exports = nextConfig;
