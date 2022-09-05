import { reducerName } from './reducer'

const root = (state) => state[reducerName]

const selectors = {
  injectSentry: (state) => root(state).injectSentry,
}

export default selectors
