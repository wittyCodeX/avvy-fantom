import constants from './constants'

export const reducerName = 'userService'

export const initialState = {
  domainIds: [],
  domainCount: null,
  loadedDomainCount: 0,

  token: null,

  // connection criteria
  hasAcceptedDisclaimers: false,
  injectSentry: false,
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.SET_DOMAIN_IDS:
      return {
        ...state,
        domainIds: action.domainIds
      }

    case constants.SET_DOMAIN_COUNT:
      return {
        ...state,
        domainCount: action.domainCount
      }

    case constants.SET_LOADED_DOMAIN_COUNT:
      return {
        ...state,
        loadedDomainCount: action.loadedDomainCount
      }

    case constants.SET_TOKEN:
      return {
        ...state,
        token: action.token
      }

    case constants.ACCEPT_DISCLAIMERS:
      return {
        hasAcceptedDisclaimers: true,
      }

    default:
      return state
  }
}

const exports = {
  reducer, 
  reducerName,
  initialState,
}

export default exports
