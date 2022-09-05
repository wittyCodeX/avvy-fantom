import constants from './constants'

export const reducerName = 'analyticsService'

export const initialState = {
  injectSentry: false,
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.INJECT_SENTRY:
      return {
        ...state,
        injectSentry: action.value
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
