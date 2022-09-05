import { reducerName } from './reducer'

const root = (state) => state[reducerName]

const selectors = {
  auctionPhases: (state) => root(state).auctionPhases,
  proofProgress: (state) => root(state).proofProgress,
  hasBidError: (state) => root(state).hasBidError,
  biddingIsComplete: (state) => root(state).biddingIsComplete,
  biddingInProgress: (state) => root(state).biddingInProgress,
  revealingBundle: (state) => root(state).revealingBundle,
  hasRevealError: (state) => root(state).hasRevealError,
  enhancedPrivacy: (state) => root(state).enableEnhancedPrivacy,
  gettingWFTM: (state) => root(state).gettingWFTM,
  auctionResults: (state) => root(state).auctionResults,
  isLoadingWinningBids: (state) => root(state).loadingWinningBids,
  availableWftm: (state) => root(state).availableWftm,
  approvedWftm: (state) => root(state).approvedWftm,
  isApprovingWftm: (state) => root(state).isApprovingWftm,
  isClaimingDomains: (state) => root(state).isClaimingDomains,
  isClaimingDomain: (state) => root(state).isClaimingDomain,
  revealedBids: (state) => root(state).revealedBids,
  winningBidsLoaded: (state) => root(state).winningBidsLoaded,
  claimGenerateProofs: (state) => root(state).claimGenerateProofs,
  loadedBidProgress: (state) => root(state).loadedBidProgress,
}

export default selectors
