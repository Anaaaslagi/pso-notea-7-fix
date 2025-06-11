import * as Sentry from '@sentry/nextjs';

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,  
    environment: process.env.NODE_ENV, 
    tracesSampleRate: 1.0, 
  });
}

export default Sentry;
