import constants from './constants'

export const reducerName = 'registerView'

export const initialState = {
  registrationPremium: null,
  commitHash: null,
  commitSalt: null,
  progress: {},
  hasCommit: false,
  hasError: false,
  isComplete: false,
  isCommitting: false,
  isFinalizing: false,
  enableEnhancedPrivacy: false,
  balance: null,
  tokenbalance: null,
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.SET_BALANCE:
      return {
        ...state,
        balance: action.balance,
      }
    case constants.SET_TOKEN_BALANCE:
      return {
        ...state,
        tokenbalance: action.balance,
      }

    case constants.SET_SALT:
      return {
        ...state,
        commitSalt: action.salt,
      }

    case constants.SET_HASH:
      return {
        ...state,
        commitHash: action.hash,
      }

    case constants.SET_PROGRESS:
      return {
        ...state,
        progress: action.progress,
      }

    case constants.SET_HAS_COMMIT:
      return {
        ...state,
        hasCommit: action.value,
      }

    case constants.SET_HAS_ERROR:
      return {
        ...state,
        hasError: action.value,
      }

    case constants.SET_IS_COMPLETE:
      return {
        ...state,
        isComplete: action.value,
      }

    case constants.SET_IS_COMMITTING:
      return {
        ...state,
        isCommitting: action.value,
      }

    case constants.SET_IS_FINALIZING:
      return {
        ...state,
        isFinalizing: action.value,
      }

    case constants.ENABLE_ENHANCED_PRIVACY:
      return {
        ...state,
        enableEnhancedPrivacy: action.value,
      }

    case constants.SET_REGISTRATION_PREMIUM:
      return {
        ...state,
        registrationPremium: action.premium,
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
