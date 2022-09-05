import reduxService from 'services/redux'

const constants = reduxService.prepareConstants(
  'views/MyDomains',
  [
    'SET_LOADING', 
  ]
)

export default constants
