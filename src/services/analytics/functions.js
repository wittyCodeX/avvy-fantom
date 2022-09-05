import services from 'services'

import * as Sentry from "@sentry/browser"
import { BrowserTracing } from "@sentry/tracing"

const functions = {
  injectSentry: () => {
    Sentry.init({
      dsn: services.environment.SENTRY_DSN,
      integrations: [new BrowserTracing()],
      environment: services.environment.ENVIRONMENT,

      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 1.0,
    });
  }
}

export default functions
