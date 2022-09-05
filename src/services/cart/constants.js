import reduxService from 'services/redux'

const constants = reduxService.prepareConstants(
  'services/cart',
  [
    'ADD_TO_CART',
    'ADD_BULK_REGISTRATIONS',
    'SET_BULK_REGISTRATION_PROGRESS',
    'REMOVE_FROM_CART',
    'SET_QUANTITY',
    'SET_NAME_DATA',
    'IS_REFRESHING_NAME_DATA',
    'SET_REFRESH_NAME_DATA_PROGRESS',
    'SET_NAME_DATA_BULK',
  ]
)

export default constants
