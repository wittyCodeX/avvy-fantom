import reduxService from 'services/redux'

const constants = reduxService.prepareConstants(
  'services/analytics',
  [
    'INJECT_SENTRY', 
  ]
)

export default constants
