import reduxService from 'services/redux'

const constants = reduxService.prepareConstants(
  'services/names',
  [
    'ADD_RECORD',
    'BULK_ADD_RECORDS',
    'IS_REVEALED',
  ]
)

export default constants
