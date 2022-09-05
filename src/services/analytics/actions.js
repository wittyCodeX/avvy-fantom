import constants from './constants'

const actions = {
  injectSentry: (value) => {
    return {
      type: constants.INJECT_SENTRY,
      value,
    }
  },
}

export default actions
