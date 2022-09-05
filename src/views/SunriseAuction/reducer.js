import constants from './constants'

export const reducerName = 'SunriseAuctionView'

export const initialState = {
  auctionPhases: null,
  availableWavax: null,
  approvedWavax: null,
  isApprovingWavax: false,
  
  // bid placement 
  proofProgress: {},
  hasBidError: false,
  biddingIsComplete: false,
  biddingInProgress: false,

  // bid reveal
  revealingBundle: {},
  hasRevealError: false,
  gettingWAVAX: false,
  enableEnhancedPrivacy: false,

  // claim
  revealedBids: [],
  auctionResults: {},
  loadingWinningBids: false,
  isClaimingDomains: false,
  isClaimingDomain: {},
  claimGenerateProofs: [],
  winningBidsLoaded: false,
  loadedBidProgress: 0,
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.SET_PROOF_PROGRESS:
      return {
        ...state,
        proofProgress: action.proofProgress
      }

    case constants.SET_HAS_BID_ERROR:
      return {
        ...state,
        hasBidError: action.hasError
      }

    case constants.SET_BIDDING_IN_PROGRESS:
      return {
        ...state,
        biddingInProgress: action.value
      }

    case constants.SET_BIDDING_IS_COMPLETE:
      return {
        ...state,
        biddingIsComplete: action.isComplete
      }

    case constants.SET_AUCTION_PHASES:
      return {
        ...state,
        auctionPhases: action.auctionPhases
      }

    case constants.ENABLE_ENHANCED_PRIVACY:
      return {
        ...state,
        enableEnhancedPrivacy: action.value
      }

    case constants.SET_REVEALING_BUNDLE:
      return {
        ...state,
        revealingBundle: {
          ...state.revealingBundle,
          [action.bundleKey]: action.value
        }
      }

    case constants.SET_HAS_REVEAL_ERROR:
      return {
        ...state,
        hasRevealError: action.value
      }

    case constants.SET_GETTING_WAVAX:
      return {
        ...state,
        gettingWAVAX: action.getting
      }

    case constants.SET_AUCTION_RESULT:
      return {
        ...state,
        auctionResults: {
          ...state.auctionResults,
          [action.domain]: action.result
        }
      }
    
    case constants.SET_LOADING_WINNING_BIDS:
      return {
        ...state,
        loadingWinningBids: action.isLoading
      }

    case constants.SET_AVAILABLE_WAVAX:
      return {
        ...state,
        availableWavax: action.amount
      }

    case constants.SET_APPROVED_WAVAX:
      return {
        ...state,
        approvedWavax: action.amount
      }

    case constants.SET_IS_APPROVING_WAVAX:
      return {
        ...state,
        isApprovingWavax: action.value
      }

    case constants.SET_REVEALED_BIDS:
      return {
        ...state,
        revealedBids: action.bids
      }

    case constants.SET_IS_CLAIMING_DOMAINS:
      return {
        ...state,
        isClaimingDomains: action.value
      }

    case constants.SET_IS_CLAIMING_DOMAIN:
      return {
        ...state,
        isClaimingDomain: {
          ...state.isClaimingDomain,
          [action.key]: action.value
        }
      }

    case constants.SET_LOADED_BID_PROGRESS:
      return {
        ...state,
        loadedBidProgress: action.progress
      }

    case constants.SET_CLAIM_GENERATE_PROOFS:
      return {
        ...state,
        claimGenerateProofs: action.value
      }

    case constants.WINNING_BIDS_LOADED:
      return {
        ...state,
        winningBidsLoaded: action.loaded
      }

    default:
      return state
  }
}

const exports = {
  reducer, 
  reducerName,
  initialState,
}

export default exports
