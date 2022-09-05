import constants from './constants'

export const reducerName = 'nameService'

export const initialState = {
  reverseLookups: {}, // these lookups use the hash as a key and resolve to the name.
  isRevealed: {}, // these lookups show whether a hash is revealed on-chain
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.ADD_RECORD:
      return {
        ...state,
        reverseLookups: {
          ...state.reverseLookups,
          [action.hash]: action.name
        }
      }

    case constants.BULK_ADD_RECORDS:
      return {
        ...state,
        reverseLookups: {
          ...state.reverseLookups,
          ...action.names.reduce((obj, name, index) => {
            const hash = action.hashes[index]
            obj[hash] = name
            return obj
          }, {})
        }
      }

    case constants.IS_REVEALED:
      return {
        ...state,
        isRevealed: {
          ...state.isRevealed,
          [action.hash]: action.isRevealed
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
