import services from 'services'

import constants from './constants'

const actions = {
  setHasAccount: (hasAccount) => {
    return {
      type: constants.SET_HAS_ACCOUNT,
      hasAccount
    }
  },

  checkHasAccount: () => {
    return async (dispatch, getState) => {
      const api = services.provider.buildAPI()
      const hasAccount = await api.checkHasAccount()
      dispatch(actions.setHasAccount(hasAccount))
    }
  },

  setAccountSignature: (signature) => {
    return {
      type: constants.SET_ACCOUNT_SIGNATURE,
      signature
    }
  },

  login: (username, password) => {
    return async (dispatch, getState) => {
      dispatch(actions.setIsLoggingIn(true))
      const token = await services.account.login(username, password)
      if (token) {
        dispatch(services.user.actions.setToken(token))
      } else {
        dispatch(actions.setLoginError('Invalid email / password'))
      }
      dispatch(actions.setIsLoggingIn(false))
    }
  },
  
  setLoginError: (error) => {
    return {
      type: constants.SET_LOGIN_ERROR,
      error
    }
  },

  setIsLoggingIn: (loggingIn) => {
    return {
      type: constants.SET_IS_LOGGING_IN,
      loggingIn,
    }
  },

  resetLogin: () => {
    return (dispatch, getState) => {
      dispatch(actions.setLoginError(null))
      dispatch(actions.setIsLoggingIn(false))
    }
  },

  setResetPasswordLoading: (loading) => {
    return {
      type: constants.SET_RESET_PASSWORD_LOADING,
      loading
    }
  },

  setResetPasswordResult: (result) => {
    return {
      type: constants.SET_RESET_PASSWORD_RESULT,
      result
    }
  },

  resetPassword: (email) => {
    return async (dispatch, getState) => {
      dispatch(actions.setResetPasswordLoading(true))
      const result = await services.account.resetPassword(email)
      dispatch(actions.setResetPasswordResult(result))
      dispatch(actions.setResetPasswordLoading(false))
    }
  },

  resetResetPassword: () => {
    return (dispatch, getState) => {
      dispatch(actions.setResetPasswordLoading(false))
      dispatch(actions.setResetPasswordResult(null))
    }
  },

  setSetPasswordResult: (result) => {
    return {
      type: constants.SET_SET_PASSWORD_RESULT,
      result,
    }
  },

  setSetPasswordError: (error) => {
    return {
      type: constants.SET_SET_PASSWORD_ERROR,
      error
    }
  },

  setSetPasswordLoading: (loading) => {
    return {
      type: constants.SET_SET_PASSWORD_LOADING,
      loading,
    }
  },

  setPassword: (token, password, passwordConfirm) => {
    return async (dispatch, getState) => {
      dispatch(actions.setSetPasswordLoading(true))
      dispatch(actions.setSetPasswordError(false))
      const res = await services.account.setPassword(token, password, passwordConfirm)
      if (res.token) {
        dispatch(services.user.actions.setToken(res.token))
        dispatch(actions.setSetPasswordResult(true))
      } else {
        dispatch(actions.setSetPasswordError(res.error))
        dispatch(actions.setSetPasswordResult(false))
      }
      dispatch(actions.setSetPasswordLoading(false))
    }
  },

  resetSetPassword: () => {
    return async (dispatch, getState) => {
      dispatch(actions.setSetPasswordResult(false))
      dispatch(actions.setSetPasswordError(null))
      dispatch(actions.setSetPasswordLoading(false))
    }
  },

  createAccount: (name, email) => {
    return async (dispatch, getState) => {
      dispatch(actions.setCreateAccountLoading(true))
      dispatch(actions.setCreateAccountError(null))
      try {
        const res = await services.account.createAccount(name, email)
        if (res.error) {
          dispatch(actions.setCreateAccountError(res.error))
        } else {
          dispatch(actions.setCreateAccountComplete(true))
        }
      } catch (err) {
        dispatch(actions.setCreateAccountError('Failed to create account'))
      }
      dispatch(actions.setCreateAccountLoading(false))
    }
  },
  
  setCreateAccountLoading: (loading) => {
    return {
      type: constants.SET_CREATE_ACCOUNT_LOADING,
      loading
    }
  },

  setCreateAccountError: (error) => {
    return {
      type: constants.SET_CREATE_ACCOUNT_ERROR,
      error
    }
  },
  
  setCreateAccountComplete: (complete) => {
    return {
      type: constants.SET_CREATE_ACCOUNT_COMPLETE,
      complete
    }
  },

  resetCreateAccount: () => {
    return (dispatch, getState) => {
      dispatch(actions.setCreateAccountLoading(false))
      dispatch(actions.setCreateAccountError(null))
      dispatch(actions.setCreateAccountComplete(false))
    }
  },

  setSignChallengeLoading: (loading) => {
    return {
      type: constants.SET_SIGN_CHALLENGE_LOADING,
      loading
    }
  },

  setSignChallengeComplete: (complete) => {
    return {
      type: constants.SET_SIGN_CHALLENGE_COMPLETE,
      complete
    }
  },

  setVerifyWalletError: (error) => {
    return {
      type: constants.SET_VERIFY_WALLET_ERROR,
      error
    }
  },

  signChallenge: () => {
    return async (dispatch, getState) => {
      dispatch(actions.setSignChallengeLoading(true))
      dispatch(actions.setVerifyWalletError(null))
      const api = services.provider.buildAPI()
      try {
        const token = services.user.selectors.token(getState())
        const challenge = await services.account.getVerifyChallenge(token)
        const signature = await services.provider.signMessage(challenge)
        const verifyRes = await services.account.submitVerifySignature(token, api.account, signature)
        if (verifyRes) {
          dispatch(actions.setSignChallengeComplete(true))
        } else {
          dispatch(actions.setVerifyWalletError('Failed to verify signature. Please try again.'))
        }
      } catch (err) {
        dispatch(actions.setSignChallengeLoading(false))
      }
      dispatch(actions.setSignChallengeLoading(false))
    }
  },

  setSubmitWalletVerificationLoading: (loading) => {
    return {
      type: constants.SET_SUBMIT_WALLET_VERIFICATION_LOADING,
      loading
    }
  },

  setSubmitWalletVerificationComplete: (complete) => {
    return {
      type: constants.SET_SUBMIT_WALLET_VERIFICATION_COMPLETE,
      complete
    }
  },

  submitWalletVerification: () => {
    return async (dispatch, getState) => {
      dispatch(actions.setSubmitWalletVerificationLoading(true))
      dispatch(actions.setVerifyWalletError(null))
      const api = services.provider.buildAPI()
      try {
        const token = services.user.selectors.token(getState())
        const signature = await services.account.getSignature(token, api.account)
        if (!signature) {
          services.logger.error('Missing signature')
          dispatch(actions.setVerifyWalletError('Failed to verify wallet. Please try again.'))
        }
        await api.submitAccountVerification(signature)
        dispatch(actions.setHasAccount(true))
      } catch (err) {
        services.logger.error(err)
        dispatch(actions.setVerifyWalletError('Failed to verify wallet. Please try again.'))
      }
      dispatch(actions.setSubmitWalletVerificationLoading(false))
    }
  },

  resetVerifyWallet: () => {
    return async (dispatch, getState) => {
      dispatch(actions.setSignChallengeLoading(false))
      dispatch(actions.setSignChallengeComplete(false))
      dispatch(actions.setVerifyWalletError(null))
      dispatch(actions.setSubmitWalletVerificationLoading(false))
      dispatch(actions.setSubmitWalletVerificationComplete(false))
    }
  },
}

export default actions
