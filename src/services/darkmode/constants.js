import reduxService from 'services/redux'

const constants = reduxService.prepareConstants(
  'services/darkmode',
  [
    'SET_DARKMODE', 
  ]
)

export default constants
