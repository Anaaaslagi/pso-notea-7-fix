import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // Pastikan `SENTRY_DSN` hanya digunakan di build/production/runtime
    SENTRY_DSN: process.env.SENTRY_DSN,
  },
};

export default withSentryConfig(nextConfig, {
  org: "sepuluh-nopember-institute--ui", // Ganti dengan organisasi Sentry Anda
  project: "noteasen-nextjs", // Ganti dengan nama proyek Sentry Anda
  
  // Hanya cetak log untuk mengupload source maps di CI
  silent: !process.env.CI,

  // Mempercepat proses upload source maps (ini akan menambah waktu build)
  widenClientFileUpload: true,

  // Menonaktifkan Sentry Logger untuk mengurangi ukuran bundle
  disableLogger: true,

  // Opsi untuk memantau Vercel Cron (hanya berfungsi dengan beberapa fitur Next.js)
  automaticVercelMonitors: true,
});
