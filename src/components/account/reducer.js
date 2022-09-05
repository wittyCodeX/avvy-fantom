import constants from './constants'

export const reducerName = 'accountComponent'

export const initialState = {
  hasAccount: null, // whether the user has linked an account on-chain
  accountSignature: null, // the signature from account server for linking on-chain

  loginError: null,
  isLoggingIn: false,
  resetPasswordResult: null,
  resetPasswordLoading: false,
  setPasswordLoading: false,
  setPasswordError: null,
  setPasswordResult: null,
  createAccountLoading: false,
  createAccountError: null,
  createAccountComplete: false,

  signChallengeLoading: false,
  signChallengeComplete: false,
  verifyWalletError: null,
  submitWalletVerificationLoading: false,
  submitWalletVerificationComplete: true,
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.SET_HAS_ACCOUNT:
      return {
        ...state,
        hasAccount: action.hasAccount
      }

    case constants.SET_ACCOUNT_SIGNATURE:
      return {
        ...state,
        accountSignature: action.signature
      }

    case constants.SET_LOGIN_ERROR:
      return {
        ...state,
        loginError: action.error
      }

    case constants.SET_IS_LOGGING_IN:
      return {
        ...state,
        isLoggingIn: action.loggingIn,
      }

    case constants.SET_RESET_PASSWORD_RESULT:
      return {
        ...state,
        resetPasswordResult: action.result,
      }

    case constants.SET_RESET_PASSWORD_LOADING:
      return {
        ...state,
        resetPasswordLoading: action.loading
      }

    case constants.SET_SET_PASSWORD_LOADING:  
      return {
        ...state,
        setPasswordLoading: action.loading
      }

    case constants.SET_SET_PASSWORD_ERROR:  
      return {
        ...state,
        setPasswordError: action.error
      }

    case constants.SET_SET_PASSWORD_RESULT:  
      return {
        ...state,
        setPasswordResult: action.result
      }

    case constants.SET_CREATE_ACCOUNT_LOADING:
      return {
        ...state,
        createAccountLoading: action.loading
      }

    case constants.SET_CREATE_ACCOUNT_ERROR:
      return {
        ...state,
        createAccountError: action.error
      }

    case constants.SET_CREATE_ACCOUNT_COMPLETE:
      return {
        ...state,
        createAccountComplete: action.complete
      }

    case constants.SET_SIGN_CHALLENGE_LOADING:
      return {
        ...state,
        signChallengeLoading: action.loading
      }

    case constants.SET_SIGN_CHALLENGE_COMPLETE:
      return {
        ...state,
        signChallengeComplete: action.complete
      }

    case constants.SET_VERIFY_WALLET_ERROR:
      return {
        ...state,
        verifyWalletError: action.error
      }

    case constants.SET_SUBMIT_WALLET_VERIFICATION_LOADING:
      return {
        ...state,
        submitWalletVerificationLoading: action.loading
      }

    case constants.SET_SUBMIT_WALLET_VERIFICATION_COMPLETE:
      return {
        ...state,
        submitWalletVerificationComplete: action.complete
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
