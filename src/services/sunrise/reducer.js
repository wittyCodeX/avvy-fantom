import constants from './constants'

import services from 'services'

export const reducerName = 'sunriseService'

export const initialState = {
  bids: {}, // bid amounts only, not necessarily submitted to the chain
  bidBundles: {}, // bids are submitted to the chain in bundles; this maps bids to bundles
  bundles: {}, // these are how the bids get submitted to the chain
  nameData: {},
  revealedBundles: {},
  constraintsProofs: {},
  claimedNames: {},
  nameDataProgress: 0,
  auctionKey: null,

  hasSeenBidDisclaimer: false,
}

const rehydrate = (action, state) => {
  const payload = action.payload ? action.payload[reducerName] : null
  if (!payload) return initialState
  const nextState = {}
  for (let key in initialState) {
    if (payload[key]) nextState[key] = payload[key]
    else nextState[key] = initialState[key]
  }
  if (nextState.auctionKey !== services.environment.AUCTION_KEY) {
    for (let key in initialState) {
      nextState[key] = initialState[key]
      nextState.auctionKey = services.environment.AUCTION_KEY
    }
  }
  return nextState
}

export const reducer = (state = initialState, action) => {

  // everything for this reducer is under a subkey for the wallet
  const account = services.provider.getAccount()

  switch (action.type) {
    case "persist/REHYDRATE":
      return rehydrate(action, state)

    case constants.SET_CONSTRAINTS_PROOF:
      return {
        ...state,
        constraintsProofs: {
          ...state.constraintsProofs,
          [account]: {
            ...state.constraintsProofs[account],
            [action.domain]: action.proof
          }
        }
      }
      
    case constants.ADD_BID:
      return {
        ...state,
        bids: {
          ...state.bids,
          [account]: {
            ...state.bids[account],
            [action.domain]: action.amount
          }
        }
      }
      
    case constants.BULK_ADD_BIDS:
      return {
        ...state,
        bids: {
          ...state.bids,
          [account]: {
            ...state.bids[account],
            ...action.names.reduce((obj, name, index) => {
              const amount = action.amounts[index]
              obj[name] = amount
              return obj
            }, {})
          }
        }
      }

    case constants.DELETE_BID:
      return {
        ...state,
        bids: {
          ...state.bids,
          [account]: Object.fromEntries(
            Object
              .entries(state.bids[account])
              .filter(([key, val]) => key !== action.domain)
          )
        }
      }

    case constants.SET_NAME_DATA:
      return {
        ...state,
        nameData: {
          ...state.nameData,
          [account]: {
            ...state.nameData[account],
            [action.name]: action.data
          }
        }
      }

    case constants.SET_ALL_NAME_DATA:
      return {
        ...state,
        nameData: {
          ...state.nameData,
          [account]: {
            ...state.nameData[account],
            ...action.names.reduce((obj, name, index) => {
              const data = action.results[index]
              obj[name] = data
              return obj
            }, {})
          }
        }
      }

    case constants.SET_NAME_DATA_PROGRESS:
      return {
        ...state,
        nameDataProgress: action.progress
      }

    case constants.ADD_BUNDLE:
      return {
        ...state,
        bundles: {
          ...state.bundles,
          [account]: {
            ...state.bundles[account],
            [action.bundleHash]: action.bundle
          }
        }
      }

    case constants.SET_BID_BUNDLE:
      return {
        ...state,
        bidBundles: {
          ...state.bidBundles,
          [account]: {
            ...state.bidBundles[account],
            [action.name]: action.bundleHash
          }
        }
      }

    case constants.REVEAL_BUNDLE:
      return {
        ...state,
        revealedBundles: {
          ...state.revealedBundles,
          [account]: {
            ...state.revealedBundles[account],
            [action.bundleHash]: true,
          }
        }
      }

    case constants.SET_CLAIMED:
      return {
        ...state,
        claimedNames: {
          ...state.claimedNames,
          [account]: {
            ...state.claimedNames[account],
            [action.name]: true
          }
        }
      }

    case constants.SET_HAS_SEEN_BID_DISCLAIMER:
      return {
        ...state,
        hasSeenBidDisclaimer: action.value
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
