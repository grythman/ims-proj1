import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

export const initializeMonitoring = () => {
    if (process.env.NODE_ENV === 'production') {
        Sentry.init({
            dsn: process.env.REACT_APP_SENTRY_DSN,
            integrations: [new BrowserTracing()],
            tracesSampleRate: 1.0,
        });
    }
}; 