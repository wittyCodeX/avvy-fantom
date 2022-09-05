import { reducerName } from './reducer'

const root = (state) => state[reducerName]

const selectors = {
  hasAccount: (state) => root(state).hasAccount,
  accountSignature: (state) => root(state).accountSignature,
  loginError: (state) => root(state).loginError,
  isLoggingIn: (state) => root(state).isLoggingIn,
  resetPasswordResult: (state) => root(state).resetPasswordResult,
  resetPasswordLoading: (state) => root(state).resetPasswordLoading,
  setPasswordResult: (state) => root(state).setPasswordResult,
  setPasswordError: (state) => root(state).setPasswordError,
  setPasswordLoading: (state) => root(state).setPasswordLoading,
  createAccountLoading: (state) => root(state).createAccountLoading,
  createAccountError: (state) => root(state).createAccountError,
  createAccountComplete: (state) => root(state).createAccountComplete,

  // sign challenge
  signChallengeLoading: (state) => root(state).signChallengeLoading,
  signChallengeComplete: (state) => root(state).signChallengeComplete,
  verifyWalletError: (state) => root(state).verifyWalletError,
  submitWalletVerificationLoading: (state) => root(state).submitWalletVerificationLoading,
  submitWalletVerificationComplete: (state) => root(state).submitWalletVerificationComplete,
}

export default selectors
