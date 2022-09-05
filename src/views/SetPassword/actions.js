import constants from './constants'
import services from 'services'

const actions = {
  setLoading: (isLoading) => {
    return {
      type: constants.SET_LOADING,
      isLoading,
    }
  },

  loadDomains: () => {
    return async (dispatch, getState) => {
      dispatch(actions.setLoading(true))
      dispatch(services.user.actions.loadDomains())
      let domains
      while (true) {
        await services.time.sleep(100)
        if (services.user.selectors.domains(getState()) !== null) {
          break
        }
      }
      dispatch(actions.setLoading(false))
    }
  },
}

export default actions
