import { reducerName } from './reducer'

const root = (state) => state[reducerName]

const selectors = {
  reverseLookups: (state) => root(state).reverseLookups,
  isRevealed: (state) => root(state).isRevealed,
}

export default selectors
