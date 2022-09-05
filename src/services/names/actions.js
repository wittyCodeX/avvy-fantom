import constants from './constants'
import services from 'services'

const actions = {
  addRecord: (name, hash) => {
    return {
      type: constants.ADD_RECORD,
      name,
      hash
    }
  },

  isRevealed: (hash, isRevealed) => {
    return {
      type: constants.IS_REVEALED,
      hash,
      isRevealed
    }
  },

  addRecordWithoutHash: (name) => {
    return async (dispatch, getState) => {
      const api = await services.provider.buildAPI()
      const hash = await api.nameHash(name)
      dispatch(actions.addRecord(name, hash))
    }
  },

  bulkAddRecords: (names, hashes) => {
    return {
      type: constants.BULK_ADD_RECORDS,
      names,
      hashes,
    }
  },

  checkIsRevealed: (hash) => {
    return async (dispatch, getState) => {
      const api = services.provider.buildAPI()
      try {
        const isRevealed = await api.isPreimageRevealed(hash)
        dispatch(actions.isRevealed(hash, isRevealed))
      } catch (err) {
      }
    }
  },

  lookup: (hash) => {
    return async (dispatch, getState) => {
      const api = services.provider.buildAPI()
      try {
        const name = await api.lookupPreimage(hash)
        dispatch(actions.addRecord(name, hash))
      } catch (err) {
      }
    }
  }
}

export default actions
