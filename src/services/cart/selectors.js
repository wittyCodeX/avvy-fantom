import { reducerName } from './reducer'

const root = (state) => state[reducerName]

const selectors = {
  names: (state) => root(state).names,
  nameData: (state) => root(state).nameData,
  quantities: (state) => root(state).quantities,
  isRefreshingNameData: (state) => root(state).isRefreshingNameData,
  bulkRegistrationProgress: (state) => root(state).bulkRegistrationProgress,
  refreshNameDataProgress: (state) => root(state).refreshNameDataProgress,
}

export default selectors
