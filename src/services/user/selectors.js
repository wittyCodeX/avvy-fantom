import { reducerName } from './reducer'

const root = (state) => state[reducerName]

const selectors = {
  domainIds: (state) => root(state).domainIds,
  domainCount: (state) => root(state).domainCount,
  loadedDomainCount: (state) => root(state).loadedDomainCount,
  token: (state) => root(state).token,

  injectSentry: (state) => root(state).injectSentry,
  hasAcceptedDisclaimers: (state) => root(state).hasAcceptedDisclaimers,
}

export default selectors
