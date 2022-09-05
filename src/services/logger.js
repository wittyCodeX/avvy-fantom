import * as Sentry from "@sentry/browser";


const logger = {
  error: (msg) => {
    Sentry.captureException(msg)
    console.log('ERROR:', msg)
  },
  info: (msg) => {
    console.log('INFO:', msg)
  }
}
export default logger
