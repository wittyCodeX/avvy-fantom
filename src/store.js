import thunk from 'redux-thunk'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import localforage from 'localforage'

// import reducers
import components from 'components'
import services from 'services'
import views from 'views'

const reducerMap = {}

const reducers = [
  components.account.reducer,
  views.Domain.redux.reducer,
  views.Register.redux.reducer,
  views.SunriseAuction.redux.reducer,
  services.analytics.reducer,
  services.cart.reducer,
  services.darkmode.reducer,
  services.names.reducer,
  services.proofs.reducer,
  services.sunrise.reducer,
  services.user.reducer,
]

reducers.forEach((service) => {
  reducerMap[service.reducerName] = service.reducer
})

const persistedReducer = persistReducer(
  {
    key: 'root',
    storage: localforage,
    whitelist: [
      services.analytics.reducer.reducerName,
      services.cart.reducer.reducerName,
      services.darkmode.reducer.reducerName,
      services.names.reducer.reducerName,
      services.proofs.reducer.reducerName,
      services.sunrise.reducer.reducerName,
      services.user.reducer.reducerName,
    ],
  },
  combineReducers(reducerMap),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
)

export const store = createStore(persistedReducer, applyMiddleware(thunk))

persistStore(store, null, () => {
  // after rehydrate
  const state = store.getState()
  const injectSentry = services.analytics.selectors.injectSentry(state)
  if (injectSentry) {
    services.analytics.functions.injectSentry()
  }
})

export default store
