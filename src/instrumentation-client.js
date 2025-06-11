// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

// Ambil DSN dari environment variable. SENTRY_DSN atau NEXT_PUBLIC_SENTRY_DSN
// SENTRY_DSN biasanya digunakan di server-side, NEXT_PUBLIC_SENTRY_DSN untuk client-side.
// Pastikan NEXT_PUBLIC_SENTRY_DSN terdefinisi di .env.local atau di lingkungan deploy Anda.
const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;

// Inisialisasi Sentry hanya di lingkungan 'production' atau 'staging'
// dan jika DSN tersedia.
if (SENTRY_DSN && (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging')) {
  Sentry.init({
    dsn: SENTRY_DSN,
    // Menggunakan NODE_ENV sebagai environment Sentry
    environment: process.env.NODE_ENV, 

    // Integrasi opsional untuk fitur tambahan (misalnya, Replay)
    integrations: [
      Sentry.replayIntegration(),
    ],

    // Menentukan seberapa sering jejak (traces) diambil sampelnya.
    // Sesuaikan nilai ini di produksi, atau gunakan tracesSampler untuk kontrol lebih besar.
    tracesSampleRate: 1.0, // Menggunakan nilai dari sentry-client-config.js

    // Menentukan seberapa sering event Replay diambil sampelnya.
    // Anda mungkin menginginkan ini 100% saat pengembangan dan sample rate lebih rendah di produksi.
    replaysSessionSampleRate: 0.1,

    // Menentukan seberapa sering event Replay diambil sampelnya saat terjadi error.
    replaysOnErrorSampleRate: 1.0,

    // Mengatur opsi ini ke true akan mencetak informasi yang berguna ke konsol saat Anda menyiapkan Sentry.
    debug: false, // Jaga agar false untuk produksi
  });
}

// Ekspor ini agar dapat digunakan oleh Sentry untuk melacak transisi router.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
