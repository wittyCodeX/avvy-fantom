import { reducerName } from './reducer'

const root = (state) => state[reducerName]

const selectors = {
  isDarkmode: (state) => root(state).isDarkmode,
}

export default selectors
