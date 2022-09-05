import constants from './constants'

import services from 'services'

export const reducerName = 'proofsService'

export const initialState = {
  pricingProofs: {},
  constraintsProofs: {},
  proofKey: null,
}

const rehydrate = (action, state) => {
  const payload = action.payload ? action.payload[reducerName] : null
  if (!payload) return initialState
  const nextState = {}
  for (let key in initialState) {
    if (payload[key]) nextState[key] = payload[key]
    else nextState[key] = initialState[key]
  }

  // invalidate proofs, for example, if we had to upgrade 
  // snarkjs or the validator contracts
  if (nextState.proofKey !== services.environment.PROOF_KEY) {
    for (let key in initialState) {
      nextState[key] = initialState[key]
      nextState.proofKey = services.environment.PROOF_KEY
    }
  }
  return nextState
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "persist/REHYDRATE":
      return rehydrate(action, state)

    case constants.SET_PRICING_PROOF:
      return {
        ...state,
        pricingProofs: {
          ...state.pricingProofs,
          [action.domain]: action.proof
        }
      }

    case constants.SET_CONSTRAINTS_PROOF:
      return {
        ...state,
        constraintsProofs: {
          ...state.constraintsProofs,
          [action.domain]: action.proof
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
