import constants from './constants'
import services from 'services'

const actions = {
  setLoading: (isLoading) => {
    return {
      type: constants.SET_LOADING,
      isLoading,
    }
  },

  setDomain: (domain) => {
    return {
      type: constants.SET_DOMAIN,
      domain,
    }
  },

  loadDomain: (_domain) => {
    return async (dispatch, getState) => {
      dispatch(actions.setLoading(true))
      const api = services.provider.buildAPI()
      let domain
      let isSupported = await api.isSupported(_domain)
      if (isSupported) {
        domain = await api.loadDomain(_domain)
        dispatch(services.names.actions.addRecord(_domain, domain.hash))
        dispatch(services.names.actions.checkIsRevealed(domain.hash))
        if (
          domain.status === domain.constants.DOMAIN_STATUSES.REGISTERED_SELF ||
          domain.status === domain.constants.DOMAIN_STATUSES.REGISTERED_OTHER
        ) {
          dispatch(actions.loadRecords(_domain))
          dispatch(actions.loadReverseRecords(_domain))
        }
        if (
          domain.status === domain.constants.DOMAIN_STATUSES.REGISTERED_SELF
        ) {
          const currExpiry = domain.expiresAt
          const now = parseInt(Date.now() / 1000)
          const oneYear = 365 * 24 * 60 * 60 // this value is directly from the LeasingAgent
          const registeredExpiry = currExpiry + 2 * oneYear
          domain.canRenew = !(
            registeredExpiry >=
            now + oneYear * services.environment.MAX_REGISTRATION_QUANTITY
          )
        }
      } else {
        domain = {
          supported: false,
          domain: _domain,
        }
      }
      dispatch(actions.setDomain(domain))
      dispatch(actions.setLoading(false))
    }
  },

  setRevealingDomain: (isRevealing) => {
    return {
      type: constants.IS_REVEALING_DOMAIN,
      isRevealing,
    }
  },

  setRevealComplete: (isRevealed) => {
    return {
      type: constants.SET_REVEAL_COMPLETE,
      isRevealed,
    }
  },

  revealDomain: (domain) => {
    return async (dispatch, getState) => {
      dispatch(actions.setRevealingDomain(true))
      const api = services.provider.buildAPI()
      const hash = await api.client.utils.nameHash(domain)
      let failed = false
      try {
        await api.revealDomain(domain)
      } catch (err) {
        failed = true
      }
      dispatch(actions.setRevealingDomain(false))
      if (!failed) {
        dispatch(actions.setRevealComplete(true))
        dispatch(services.names.actions.isRevealed(hash, true))
      }
    }
  },

  resetRevealDomain: () => {
    return async (dispatch, getState) => {
      dispatch(actions.setRevealingDomain(false))
      dispatch(actions.setRevealComplete(false))
    }
  },

  setAuctionPhases: (auctionPhases) => {
    return {
      type: constants.SET_AUCTION_PHASES,
      auctionPhases,
    }
  },

  loadAuctionPhases: () => {
    return async (dispatch, getState) => {
      const api = services.provider.buildAPI()
      const auctionPhases = await api.getAuctionPhases()
      dispatch(actions.setAuctionPhases(auctionPhases))
    }
  },

  setRegistrationPremium: (premium) => {
    return {
      type: constants.SET_REGISTRATION_PREMIUM,
      premium,
    }
  },

  loadRegistrationPremium: () => {
    return async (dispatch, getState) => {
      const api = services.provider.buildAPI()
      const premium = await api.getRegistrationPremium()
      dispatch(actions.setRegistrationPremium(premium))
    }
  },

  // records

  isSettingRecord: (value) => {
    return {
      type: constants.IS_SETTING_RECORD,
      value,
    }
  },

  setRecordComplete: (value) => {
    return {
      type: constants.SET_RECORD_COMPLETE,
      value,
    }
  },

  setStandardRecord: (domain, type, value) => {
    return async (dispatch, getState) => {
      dispatch(actions.isSettingRecord(true))
      const api = services.provider.buildAPI()
      try {
        await api.setStandardRecord(domain, type, value)
        dispatch(actions.loadRecords(domain))
        dispatch(actions.setRecordComplete(true))
      } catch (err) {
        services.logger.error(err)
        alert('Failed to set record')
      }
      dispatch(actions.isSettingRecord(false))
    }
  },

  isLoadingRecords: (value) => {
    return {
      type: constants.IS_LOADING_RECORDS,
      value,
    }
  },

  recordsLoaded: (records) => {
    return {
      type: constants.RECORDS_LOADED,
      records,
    }
  },

  _setResolver: (resolver) => {
    return {
      type: constants.SET_RESOLVER,
      resolver,
    }
  },

  setResolverLoading: (loading) => {
    return {
      type: constants.SET_RESOLVER_LOADING,
      loading,
    }
  },

  setResolverComplete: (complete) => {
    return {
      type: constants.SET_RESOLVER_COMPLETE,
      complete,
    }
  },

  setResolver: (domain, resolverAddress) => {
    return async (dispatch, getState) => {
      dispatch(actions.setResolverLoading(true))
      const api = await services.provider.buildAPI()
      try {
        await api.setResolver(domain, resolverAddress)
        setTimeout(() => {
          dispatch(actions.loadRecords(domain))
          dispatch(actions.setResolverComplete(true))
        }, 1000)
      } catch (err) {
        alert('Failed to set resolver')
      }
      dispatch(actions.setResolverLoading(false))
    }
  },

  loadRecords: (domain) => {
    return async (dispatch, getState) => {
      dispatch(actions.isLoadingRecords(true))
      const api = services.provider.buildAPI()
      const recordsByKey = api.fns.RECORDS._LIST.reduce((sum, curr) => {
        sum[curr.key] = curr
        return sum
      }, {})
      let resolver = null
      try {
        resolver = await api.getResolver(domain)
      } catch (err) {
        resolver = null
      }
      dispatch(actions._setResolver(resolver))
      if (resolver) {
        const records = await api.getStandardRecords(domain)
        dispatch(
          actions.recordsLoaded(
            records.map((record) => {
              const obj = Object.assign(record, recordsByKey[record.type])
              return obj
            }),
          ),
        )
      } else {
        dispatch(actions.recordsLoaded([]))
      }
      dispatch(actions.isLoadingRecords(false))
    }
  },

  isLoadingReverseRecords: (isLoading) => {
    return {
      type: constants.IS_LOADING_REVERSE_RECORDS,
      isLoading,
    }
  },

  setReverseRecords: (reverseRecords) => {
    return {
      type: constants.SET_REVERSE_RECORDS,
      reverseRecords,
    }
  },

  isSettingEVMReverseRecord: (isLoading) => {
    return {
      type: constants.IS_SETTING_EVM_REVERSE_RECORD,
      isLoading,
    }
  },

  isSettingEVMReverseRecordComplete: (isComplete) => {
    return {
      type: constants.IS_SETTING_EVM_REVERSE_RECORD_COMPLETE,
      isComplete,
    }
  },

  setEVMReverseRecord: (domain) => {
    return async (dispatch, getState) => {
      dispatch(actions.isSettingEVMReverseRecord(true))
      try {
        const api = services.provider.buildAPI()
        await api.setEVMReverseRecord(domain)
        dispatch(
          actions.setReverseRecords({
            [api.fns.RECORDS.EVM]: api.account,
          }),
        )
        dispatch(actions.isSettingEVMReverseRecordComplete(true))
      } catch (e) {
        console.log(e)
        alert('Failed to set reverse record')
      }
      dispatch(actions.isSettingEVMReverseRecord(false))
    }
  },

  resetSetEVMReverseRecord: () => {
    return async (dispatch, getState) => {
      dispatch(actions.isSettingEVMReverseRecordComplete(false))
      dispatch(actions.isSettingEVMReverseRecord(false))
    }
  },

  loadReverseRecords: (domain) => {
    return async (dispatch, getState) => {
      dispatch(actions.isLoadingReverseRecords(true))
      const api = services.provider.buildAPI()
      const reverseRecords = await api.getReverseRecords(domain)
      dispatch(actions.setReverseRecords(reverseRecords))
      dispatch(actions.isLoadingReverseRecords(false))
    }
  },

  transferDomainSuccess: (success) => {
    return {
      type: constants.TRANSFER_DOMAIN_SUCCESS,
      success,
    }
  },

  isTransferringDomain: (transferring) => {
    return {
      type: constants.IS_TRANSFERRING_DOMAIN,
      transferring,
    }
  },

  transferDomainError: (error) => {
    return {
      type: constants.TRANSFER_DOMAIN_ERROR,
      error,
    }
  },

  resetTransferDomain: () => {
    return async (dispatch, getState) => {
      dispatch(actions.transferDomainSuccess(false))
      dispatch(actions.isTransferringDomain(false))
      dispatch(actions.transferDomainError(null))
    }
  },

  transferDomain: (domain, address) => {
    return async (dispatch, getState) => {
      dispatch(actions.isTransferringDomain(true))
      dispatch(actions.transferDomainError(null))

      const api = services.provider.buildAPI()
      try {
        await api.transferDomain(domain, address)
        dispatch(actions.transferDomainSuccess(true))
      } catch (err) {
        dispatch(actions.transferDomainError(err.message))
      }
      dispatch(actions.isTransferringDomain(false))
    }
  },
}

export default actions
