import constants from './constants'
import selectors from './selectors'
import services from 'services'

const actions = {
  _addBid: (domain, amount) => {
    return {
      type: constants.ADD_BID,
      domain,
      amount
    }
  },

  addBid: (domain, amount) => {
    return (dispatch, getState) => {
      dispatch(actions._addBid(domain, amount))
      dispatch(actions.refreshNameData(domain))
    }
  },

  _bulkAddBids: (names, amounts) => {
    return {
      type: constants.BULK_ADD_BIDS,
      names,
      amounts,
    }
  },

  bulkAddBids: (names, amounts) => {
    return (dispatch, getState) => {
      dispatch(actions._bulkAddBids(names, amounts))
      dispatch(actions.refreshAllNameData())
    }
  },

  deleteBid: (domain) => {
    return {
      type: constants.DELETE_BID,
      domain,
    }
  },

  addBundle: (bundleHash, bundle) => {
    return {
      type: constants.ADD_BUNDLE,
      bundleHash,
      bundle,
    }
  },

  setBidBundle: (name, bundleHash) => {
    return {
      type: constants.SET_BID_BUNDLE,
      name,
      bundleHash
    }
  },

  revealBundle: (bundleHash) => {
    return {
      type: constants.REVEAL_BUNDLE,
      bundleHash
    }
  },

  setNameData: (name, data) => {
    return {
      type: constants.SET_NAME_DATA,
      name,
      data
    }
  },

  refreshNameData: (name) => {
    return async (dispatch, getState) => {
      const api = services.provider.buildAPI()
      const data = await api.loadDomain(name)
      dispatch(actions.setNameData(name, data))
    }
  },

  setNameDataProgress: (progress) => {
    return {
      type: constants.SET_NAME_DATA_PROGRESS,
      progress
    }
  },

  setAllNameData: (names, results) => {
    return {
      type: constants.SET_ALL_NAME_DATA,
      names, 
      results,
    }
  },

  refreshAllNameData: () => {
    return async (dispatch, getState) => {
      const api = services.provider.buildAPI()
      const names = selectors.names(getState())
      const batchSize = 50
      const numBatches = Math.floor(names.length / batchSize)
      let currBatch = 0
      let promises = []
      let results = []
      dispatch(actions.setNameDataProgress(0))
      for (let i = 0; i < names.length; i += 1) {
        promises.push(api.loadDomain(names[i]))
        if (promises.length > batchSize || i === names.length - 1) {
          let _results = await Promise.all(promises)
          results = results.concat(_results)
          currBatch += 1
          promises = []
          dispatch(actions.setNameDataProgress(parseInt((currBatch / numBatches) * 100)))
        }
      }
      dispatch(actions.setNameDataProgress(100))
      dispatch(actions.setAllNameData(names, results))
    }
  },

  setConstraintsProof: (domain, proof) => {
    return {
      type: constants.SET_CONSTRAINTS_PROOF,
      domain,
      proof,
    }
  },

  setClaimed: (name) => {
    return {
      type: constants.SET_CLAIMED,
      name,
    }
  },

  setHasSeenBidDisclaimer: (value) => {
    return {
      type: constants.SET_HAS_SEEN_BID_DISCLAIMER,
      value
    }
  },
}

export default actions
