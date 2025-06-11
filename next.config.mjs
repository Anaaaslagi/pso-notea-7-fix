/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    SENTRY_DSN: process.env.SENTRY_DSN,  
  },
};

export default nextConfig;
