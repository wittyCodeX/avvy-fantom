import { reducerName } from './reducer'

const root = (state) => state[reducerName]

const selectors = {
  isLoading: (state) => root(state).isLoading,
  domain: (state) => root(state).domain,
  auctionPhases: (state) => root(state).auctionPhases,
  registrationPremium: (state) => root(state).registrationPremium,

  isSettingRecord: (state) => root(state).isSettingRecord,
  isLoadingRecords: (state) => root(state).isLoadingRecords,
  records: (state) => root(state).records,
  setRecordComplete: (state) => root(state).setRecordComplete,
  avatarRecord: (state) => root(state).avatarRecord,
  resolver: (state) => root(state).resolver,
  setResolverLoading: (state) => root(state).setResolverLoading,
  setResolverComplete: (state) => root(state).setResolverComplete,

  isLoadingReverseRecords: (state) => root(state).isLoadingReverseRecords,
  reverseRecords: (state) => root(state).reverseRecords,
  isSettingEVMReverseRecord: (state) => root(state).isSettingEVMReverseRecord,
  isSettingEVMReverseRecordComplete: (state) => root(state).isSettingEVMReverseRecordComplete,

  isRevealingDomain: (state) => root(state).isRevealingDomain,
  isRevealComplete: (state) => root(state).isRevealComplete,

  // transfer
  isTransferringDomain: (state) => root(state).isTransferringDomain,
  transferDomainSuccess: (state) => root(state).transferDomainSuccess,
  transferDomainError: (state) => root(state).transferDomainError,
}

export default selectors
