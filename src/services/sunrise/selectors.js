import { reducerName } from './reducer'
import services from 'services'

const root = (state) => state[reducerName]

const account = (subState) => {
  const acc = services.provider.getAccount()
  return subState[acc] || {}
}

const selectors = {
  bids: (state) => account(root(state).bids),
  names: (state) => Object.keys(selectors.bids(state)),
  nameData: (state) => account(root(state).nameData),
  bidBundles: (state) => account(root(state).bidBundles),
  bundles: (state) => account(root(state).bundles),
  unsubmittedBidNames: (state) => {

    // all names which have bids which are not reflected
    // in bundles
    const bids = selectors.bids(state)
    const bidBundles = selectors.bidBundles(state)
    const bundles = selectors.bundles(state)
    const names = []
    Object.keys(bids).forEach((name) => {
      if (!bidBundles[name]) names.push(name)
      else {
        let bundleId = bidBundles[name]
        let bundle = bundles[bundleId]
        if (!bundle || bundle[name].amount !== bids[name]) {
          names.push(name)
        }
      }
    })
    return names
  },

  revealedBundles: (state) => account(root(state).revealedBundles),
  revealedBidNames: (state) => {
    const revealedBundles = selectors.revealedBundles(state)
    const bidBundles = selectors.bidBundles(state)
    const names = []
    Object.keys(bidBundles).forEach(domain => {
      if (revealedBundles[bidBundles[domain]]) names.push(domain)
    })
    return names
  },
  constraintsProofs: (state) => account(root(state).constraintsProofs),
  claimedNames: (state) => account(root(state).claimedNames),
  nameDataProgress: (state) => root(state).nameDataProgress,
  hasSeenBidDisclaimer: (state) => root(state).hasSeenBidDisclaimer,
}

export default selectors
