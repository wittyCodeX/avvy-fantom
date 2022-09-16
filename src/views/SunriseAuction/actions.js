import constants from './constants'
import selectors from './selectors'
import services from 'services'

import client from 'clients'
import { ethers } from 'ethers'

const actions = {
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

  setProofProgress: (proofProgress) => {
    return {
      type: constants.SET_PROOF_PROGRESS,
      proofProgress,
    }
  },

  setHasBidError: (hasError) => {
    return {
      type: constants.SET_HAS_BID_ERROR,
      hasError,
    }
  },

  setBiddingIsComplete: (isComplete) => {
    return {
      type: constants.SET_BIDDING_IS_COMPLETE,
      isComplete,
    }
  },

  setBiddingInProgress: (value) => {
    return {
      type: constants.SET_BIDDING_IN_PROGRESS,
      value,
    }
  },

  resetBidding: () => {
    return (dispatch, getState) => {
      dispatch(actions.setBiddingIsComplete(false))
    }
  },

  generateProofs: (names) => {
    return async (dispatch, getState) => {
      try {
        const state = getState()
        const names = services.sunrise.selectors.unsubmittedBidNames(state)
        const constraintsProofs = services.proofs.selectors.constraintsProofs(
          state,
        )
        const api = services.provider.buildAPI()
        let j = 0
        const numSteps = names.length
        for (let i = 0; i < names.length; i += 1) {
          let name = names[i]
          dispatch(
            actions.setProofProgress({
              message: `Generating constraints proof for ${name} (${j}/${numSteps})`,
              percent: parseInt((j / numSteps) * 100),
            }),
          )
          if (!constraintsProofs[name]) {
            let constraintsRes = await api.generateConstraintsProof(name)
            dispatch(
              services.proofs.actions.setConstraintsProof(
                name,
                constraintsRes.calldata,
              ),
            )
          }
          j += 1
        }
        dispatch(
          actions.setProofProgress({
            message: `Done`,
            percent: 100,
          }),
        )
      } catch (err) {
        services.logger.error(err)
        console.log(err)
        return dispatch(actions.setHasBidError(true))
      }
    }
  },

  submitBid: () => {
    return async (dispatch, getState) => {
      dispatch(actions.setBiddingInProgress(true))
      const api = services.provider.buildAPI()
      const state = getState()

      // this maps bids to "bundles" which get submitted to the chain
      const bids = services.sunrise.selectors.bids(state)
      const names = services.sunrise.selectors.unsubmittedBidNames(state)

      const bundles = []
      let bundle
      let bidBundles = {}
      let MAX_BIDS_PER_BUNDLE = 15
      let counter

      for (let i = 0; i < names.length; i += 1) {
        if (i % MAX_BIDS_PER_BUNDLE === 0) {
          bundle = {
            payload: {
              names: [],
              amounts: [],
              salt: services.random.salt(),
            },
          }
          bundles.push(bundle)
          counter = 0
        }

        let name = names[i]
        let hash = await client.utils.nameHash(name)
        bundle.payload.names[counter] = hash.toString()
        bundle.payload.amounts[counter] = bids[name]
        bundle[name] = {
          amount: bids[name],
          hash: hash.toString(),
        }
        bidBundles[name] = bundles.length - 1
        counter += 1
      }

      for (let i = 0; i < bundles.length; i += 1) {
        let bundle = bundles[i]
        bundle.payload.hash = ethers.utils.keccak256(
          ethers.utils.defaultAbiCoder.encode(
            ['int[]', 'int[]', 'string'],
            [bundle.payload.names, bundle.payload.amounts, bundle.payload.salt],
          ),
        )
      }

      try {
        await api.bid(bundles.map((bundle) => bundle.payload.hash))
      } catch (err) {
        console.log(err)
        return dispatch(actions.setHasBidError(true))
      }

      for (let name in bidBundles) {
        let bundleIndex = bidBundles[name]
        let hash = bundles[bundleIndex].payload.hash
        dispatch(services.sunrise.actions.setBidBundle(name, hash))
      }

      for (let i = 0; i < bundles.length; i += 1) {
        dispatch(
          services.sunrise.actions.addBundle(
            bundles[i].payload.hash,
            bundles[i],
          ),
        )
      }

      dispatch(actions.setBiddingInProgress(false))
      dispatch(actions.setBiddingIsComplete(true))
    }
  },

  setRevealingBundle: (bundleKey, value) => {
    return {
      type: constants.SET_REVEALING_BUNDLE,
      bundleKey,
      value,
    }
  },

  setHasRevealError: (value) => {
    return {
      type: constants.SET_HAS_REVEAL_ERROR,
      value,
    }
  },

  revealBundle: (bundleKey) => {
    return async (dispatch, getState) => {
      dispatch(actions.setRevealingBundle(bundleKey, true))
      const api = services.provider.buildAPI()
      const state = getState()
      const bundles = services.sunrise.selectors.bundles(state)
      const bundle = bundles[bundleKey]
      const enhancedPrivacy = selectors.enhancedPrivacy(state)
      const reverseLookups = services.names.selectors.reverseLookups(state)

      try {
        if (enhancedPrivacy) {
          await api.reveal(
            bundle.payload.names,
            bundle.payload.amounts,
            bundle.payload.salt,
          )
        } else {
          const names = bundle.payload.names.map((n) => reverseLookups[n])
          const preimages = await api.buildPreimages(names)
          await api.revealWithPreimage(
            bundle.payload.names,
            bundle.payload.amounts,
            bundle.payload.salt,
            preimages,
          )
        }
        dispatch(services.sunrise.actions.revealBundle(bundleKey))
      } catch (err) {
        console.log(err)
        dispatch(actions.setRevealingBundle(bundleKey, false))
        return dispatch(actions.setHasRevealError(true))
      }
      dispatch(actions.setRevealingBundle(bundleKey, false))
    }
  },

  enableEnhancedPrivacy: (value) => {
    return {
      type: constants.ENABLE_ENHANCED_PRIVACY,
      value,
    }
  },

  setAuctionResult: (domain, result) => {
    return {
      type: constants.SET_AUCTION_RESULT,
      domain,
      result,
    }
  },

  setLoadingWinningBids: (isLoading) => {
    return {
      type: constants.SET_LOADING_WINNING_BIDS,
      isLoading,
    }
  },

  winningBidsLoaded: (loaded) => {
    return {
      type: constants.WINNING_BIDS_LOADED,
      loaded,
    }
  },

  setRevealedBids: (bids) => {
    return {
      type: constants.SET_REVEALED_BIDS,
      bids,
    }
  },

  setLoadedBidProgress: (progress) => {
    return {
      type: constants.SET_LOADED_BID_PROGRESS,
      progress,
    }
  },

  loadWinningBids: (force) => {
    return async (dispatch, getState) => {
      const state = getState()
      const isLoading = selectors.isLoadingWinningBids(state)
      const reverseLookups = services.names.selectors.reverseLookups(state)
      if (isLoading && !force) return
      dispatch(actions.setLoadedBidProgress(0))
      dispatch(actions.setLoadingWinningBids(true))
      const api = services.provider.buildAPI()
      const revealedBidCount = await api.getRevealedBidForSenderCount()
      let promises = []
      let loadedBidCount = 0
      let totalProgressCount = revealedBidCount * 2

      if (revealedBidCount.eq('0')) {
        dispatch(actions.setLoadedBidProgress(100))
        dispatch(actions.setLoadingWinningBids(false))
        dispatch(actions.winningBidsLoaded(true))
        return
      }

      let revealedBids = []

      for (let i = 0; i < revealedBidCount; i += 1) {
        promises.push(
          new Promise(async (resolve, reject) => {
            const bid = await api.getRevealedBidForSenderAtIndex(i)
            return resolve(bid)
          }),
        )
        if (promises.length >= 50 || i === revealedBidCount - 1) {
          let output = await Promise.all(promises)
          revealedBids = revealedBids.concat(output)
          loadedBidCount += promises.length
          dispatch(
            actions.setLoadedBidProgress(
              parseInt((loadedBidCount / totalProgressCount) * 100),
            ),
          )
          promises = []
        }
      }

      // add in names that we are missing here
      dispatch(actions.setRevealedBids(revealedBids))
      for (let i = 0; i < revealedBids.length; i += 1) {
        let domain
        if (revealedBids[i].preimage) {
          domain = revealedBids[i].preimage
        } else {
          domain = reverseLookups[revealedBids[i].name.toString()]
        }
        if (domain) {
          let result = await api.getWinningBid(domain)
          dispatch(services.sunrise.actions.refreshNameData(domain))
          dispatch(actions.setAuctionResult(domain, result))
        }
        loadedBidCount += 1
        dispatch(
          actions.setLoadedBidProgress(
            parseInt((loadedBidCount / totalProgressCount) * 100),
          ),
        )
      }
      dispatch(actions.winningBidsLoaded(true))
    }
  },

  setAvailableWftm: (amount) => {
    return {
      type: constants.SET_AVAILABLE_WFTM,
      amount,
    }
  },

  setApprovedWftm: (amount) => {
    return {
      type: constants.SET_APPROVED_WFTM,
      amount,
    }
  },

  checkAvailableWFTM: () => {
    return async (dispatch, getState) => {
      const api = services.provider.buildAPI()
      const wftm = await api.getAuctionWftm()
      const balance = await api.getWftmBalance()
      dispatch(actions.setAvailableWftm(balance))
      dispatch(actions.setApprovedWftm(wftm))
    }
  },

  gettingWFTM: (getting) => {
    return {
      type: constants.SET_GETTING_WFTM,
      getting,
    }
  },

  getWFTM: (amount) => {
    return async (dispatch, getState) => {
      dispatch(actions.gettingWFTM(true))
      try {
        const api = services.provider.buildAPI()
        await api.wrapFtm(amount)
        dispatch(actions.checkAvailableWFTM())
      } catch (err) {}
      dispatch(actions.loadWinningBids(true))
      dispatch(actions.gettingWFTM(false))
    }
  },

  isApprovingWftm: (value) => {
    return {
      type: constants.SET_IS_APPROVING_WFTM,
      value,
    }
  },

  approveWftm: (total) => {
    return async (dispatch, getState) => {
      dispatch(actions.isApprovingWftm(true))
      const api = services.provider.buildAPI()
      try {
        await api.approveWftmForAuction(total)
      } catch (err) {}
      dispatch(actions.checkAvailableWFTM())
      dispatch(actions.loadWinningBids(true))
      dispatch(actions.isApprovingWftm(false))
    }
  },

  isClaimingDomains: (value) => {
    return {
      type: constants.SET_IS_CLAIMING_DOMAINS,
      value,
    }
  },

  isClaimingDomain: (key, value) => {
    return {
      type: constants.SET_IS_CLAIMING_DOMAIN,
      key,
      value,
    }
  },

  setClaimGenerateProofs: (value) => {
    return {
      type: constants.SET_CLAIM_GENERATE_PROOFS,
      value,
    }
  },

  claim: (key) => {
    return async (dispatch, getState) => {
      dispatch(actions.isClaimingDomain(key, true))
      const api = services.provider.buildAPI()
      const state = getState()
      const auctionResults = selectors.auctionResults(state)
      const constraintsProofs = services.proofs.selectors.constraintsProofs(
        state,
      )
      const names = []
      const constraintsData = []
      const missingProofs = []
      for (let name in auctionResults) {
        if (
          auctionResults[name].isWinner &&
          auctionResults[name].type !== 'IS_CLAIMED' &&
          name === key
        ) {
          names.push(name)
          if (constraintsProofs[name]) {
            constraintsData.push(constraintsProofs[name])
          } else {
            missingProofs.push(name)
          }
        }
      }
      if (missingProofs.length > 0) {
        dispatch(actions.setClaimGenerateProofs(missingProofs))
        dispatch(actions.isClaimingDomain(key, false))
        return
      }
      if (names.length === 0) {
        dispatch(actions.isClaimingDomain(key, false))
      }
      try {
        await api.sunriseClaim(names, constraintsData)
        names.forEach((name) => {
          dispatch(services.sunrise.actions.setClaimed(name))
          dispatch(
            actions.setAuctionResult(
              name,
              Object.assign(auctionResults[name], {
                type: 'IS_CLAIMED',
              }),
            ),
          )
        })
      } catch (err) {
        console.log(err)
        alert('Failed to claim domain')
        dispatch(actions.isClaimingDomain(key, false))
      }
      dispatch(actions.isClaimingDomain(key, false))
    }
  },

  claimAll: () => {
    return async (dispatch, getState) => {
      dispatch(actions.isClaimingDomains(true))
      const api = services.provider.buildAPI()
      const state = getState()
      const auctionResults = selectors.auctionResults(state)
      const constraintsProofs = services.proofs.selectors.constraintsProofs(
        state,
      )
      const names = []
      const constraintsData = []
      const missingProofs = []
      for (let name in auctionResults) {
        if (
          auctionResults[name].isWinner &&
          auctionResults[name].type !== 'IS_CLAIMED'
        ) {
          names.push(name)
          if (constraintsProofs[name]) {
            constraintsData.push(constraintsProofs[name])
          } else {
            missingProofs.push(name)
          }
        }
        if (names.length >= 12) break
      }
      if (missingProofs.length > 0) {
        dispatch(actions.setClaimGenerateProofs(missingProofs))
        dispatch(actions.isClaimingDomains(false))
        return
      }
      if (names.length === 0) {
        dispatch(actions.isClaimingDomains(false))
      }
      try {
        await api.sunriseClaim(names, constraintsData)
        names.forEach((name) => {
          dispatch(services.sunrise.actions.setClaimed(name))
          dispatch(
            actions.setAuctionResult(
              name,
              Object.assign(auctionResults[name], {
                type: 'IS_CLAIMED',
              }),
            ),
          )
        })
      } catch (err) {
        console.log(err)
        alert('Failed to claim domains')
        dispatch(actions.isClaimingDomains(false))
      }
      dispatch(actions.isClaimingDomains(false))
    }
  },

  addBulkBids: (bids) => {
    return async (dispatch, getState) => {
      const api = services.provider.buildAPI()
      const domains = []
      const hashes = []
      const amounts = []
      for (let _domain in bids) {
        let domain = _domain.toLowerCase()
        let isSupported = await api.isSupported(domain)
        if (isSupported) {
          try {
            ethers.BigNumber.from(bids[domain])
            const hash = await client.utils.nameHash(domain)
            domains.push(domain)
            hashes.push(hash.toString())
            amounts.push(bids[domain])
          } catch (err) {}
        } else {
        }
      }
      dispatch(services.names.actions.bulkAddRecords(domains, hashes))
      dispatch(services.sunrise.actions.bulkAddBids(domains, amounts))
    }
  },

  generateClaimProofs: (names) => {
    return async (dispatch, getState) => {
      try {
        const state = getState()
        const api = services.provider.buildAPI()
        let j = 0
        const numSteps = names.length
        for (let i = 0; i < names.length; i += 1) {
          let name = names[i]
          dispatch(
            actions.setProofProgress({
              message: `Generating constraints proof for ${name} (${j}/${numSteps})`,
              percent: parseInt((j / numSteps) * 100),
            }),
          )
          let constraintsRes = await api.generateConstraintsProof(name)
          dispatch(
            services.proofs.actions.setConstraintsProof(
              name,
              constraintsRes.calldata,
            ),
          )
          j += 1
        }
        dispatch(
          actions.setProofProgress({
            message: `Done`,
            percent: 100,
          }),
        )
      } catch (err) {
        services.logger.error(err)
        console.log(err)
        return dispatch(actions.setHasBidError(true))
      }
    }
  },
}

export default actions
