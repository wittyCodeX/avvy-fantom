import constants from './constants'
import functions from './functions'

export const reducerName = 'darkmodeService'

export const initialState = {
  isDarkmode: false
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "persist/REHYDRATE":
      if (action.payload?.darkmodeService?.isDarkmode) {
        functions.setDOMDarkmode(true)
        return {
          ...state,
          isDarkmode: true
        }
      } else {
        return state
      }

    case constants.SET_DARKMODE:
      return {
        ...state,
        isDarkmode: action.value
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
