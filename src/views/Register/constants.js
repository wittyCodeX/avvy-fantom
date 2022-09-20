import reduxService from 'services/redux'

const constants = reduxService.prepareConstants('views/Register', [
  'SET_REGISTRATION_PREMIUM',
  'SET_HASH',
  'SET_SALT',
  'SET_PROGRESS',
  'SET_HAS_COMMIT',
  'SET_HAS_ERROR',
  'SET_IS_COMPLETE',
  'SET_IS_COMMITTING',
  'SET_IS_FINALIZING',
  'ENABLE_ENHANCED_PRIVACY',
  'SET_BALANCE',
  'SET_TOKEN_BALANCE',
])

export default constants
