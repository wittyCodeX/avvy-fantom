import { reducerName } from './reducer'

const root = (state) => state[reducerName]

const selectors = {
  constraintsProofs: (state) => root(state).constraintsProofs,
  pricingProofs: (state) => root(state).pricingProofs,
}

export default selectors
