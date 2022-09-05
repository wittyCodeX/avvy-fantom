import { reducerName } from './reducer'

const root = (state) => state[reducerName]

const selectors = {
  isLoading: (state) => root(state).isLoading,
}

export default selectors
