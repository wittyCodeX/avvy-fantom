import constants from './constants'

export const reducerName = 'cartService'

export const initialState = {
  names: [],
  quantities: {},
  nameData: {},
  isRefreshingNameData: false,
  bulkRegistrationProgress: 0,
  refreshNameDataProgress: 0,
}

export const reducer = (state = initialState, action) => {
  let index
  switch (action.type) {
    case constants.ADD_TO_CART:
      if (state.names.indexOf(action.name) > -1) return state
      return {
        ...state,
        names: [
          ...state.names,
          action.name
        ],
        quantities: {
          ...state.quantities,
          [action.name]: 1
        },
      }

    case constants.REMOVE_FROM_CART:
      index = state.names.indexOf(action.name)
      return {
        ...state,
        names: [...state.names.slice(0, index), ...state.names.slice(index + 1)],
      }

    case constants.SET_QUANTITY:
      return {
        ...state,
        quantities: {
          ...state.quantities,
          [action.name]: action.quantity
        }
      }

    case constants.SET_NAME_DATA:
      return {
        ...state,
        nameData: {
          ...state.nameData,
          [action.name]: action.data
        }
      }

    case constants.ADD_BULK_REGISTRATIONS:
      return {
        ...state,
        names: [
          ...state.names,
          ...action.names.filter(name => state.names.indexOf(name === -1)),
        ],
        nameData: {
          ...state.nameData,
          ...action.nameData,
        },
        quantities: {
          ...state.quantities,
          ...action.quantities,
        },
      }

    case constants.SET_BULK_REGISTRATION_PROGRESS:
      return {
        ...state,
        bulkRegistrationProgress: action.progress
      }

    case constants.IS_REFRESHING_NAME_DATA:
      return {
        ...state,
        isRefreshingNameData: action.value
      }

    case constants.SET_REFRESH_NAME_DATA_PROGRESS:
      return {
        ...state,
        refreshNameDataProgress: action.progress
      }

    case constants.SET_NAME_DATA_BULK:
      return {
        ...state,
        nameData: {
          ...state.nameData,
          ...action.nameData
        }
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
