import * as Sentry from '@sentry/node';

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,  
    environment: process.env.NODE_ENV, 
    release: process.env.GITHUB_SHA || 'manual-release',  
  });
}

export default Sentry;
