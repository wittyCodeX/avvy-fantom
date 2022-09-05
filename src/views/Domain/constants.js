import reduxService from 'services/redux'

const constants = reduxService.prepareConstants(
  'views/MyDomains',
  [
    'SET_DOMAIN',
    'SET_LOADING', 
    'SET_AUCTION_PHASES',
    'SET_REGISTRATION_PREMIUM',

    // records
    'IS_SETTING_RECORD',
    'IS_LOADING_RECORDS',
    'RECORDS_LOADED',
    'SET_RECORD_COMPLETE',
    'SET_RESOLVER',
    'SET_RESOLVER_LOADING',
    'SET_RESOLVER_COMPLETE',

    // reverse records
    'IS_LOADING_REVERSE_RECORDS',
    'SET_REVERSE_RECORDS',
    'IS_SETTING_EVM_REVERSE_RECORD',
    'IS_SETTING_EVM_REVERSE_RECORD_COMPLETE',

    // revealing
    'IS_REVEALING_DOMAIN',
    'SET_REVEAL_COMPLETE',

    // transferring
    'TRANSFER_DOMAIN_SUCCESS',
    'TRANSFER_DOMAIN_ERROR',
    'IS_TRANSFERRING_DOMAIN',
  ]
)

export default constants
