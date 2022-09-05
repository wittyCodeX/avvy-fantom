import React from 'react'
import { connect } from 'react-redux'
import { ethers } from 'ethers'
import { Link } from 'react-router-dom'
import { ExternalLinkIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'

import components from 'components'
import services from 'services'

import actions from './actions'
import selectors from './selectors'

import AuctionPhase from './AuctionPhase'
import BidFlow from './BidFlow'
import RevealFlow from './RevealFlow'
import ClaimProofFlow from './ClaimProofFlow'
import Summary from './Summary'



class MyBids extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isConnected: services.provider.isConnected(),
      paginationIndex: 0,
      hasLoadedWinningBids: false
    }
  }

  onConnect() {
    setTimeout(() => {
      this.setState({
        isConnected: services.provider.isConnected(),
      })
      this.props.loadWinningBids(true)
    }, 1)
  }

  componentDidMount() {
    this.props.loadAuctionPhases()
    services.provider.addEventListener(services.provider.EVENTS.CONNECTED, this.onConnect.bind(this))
  }

  componentWillUnmount() {
    services.provider.removeEventListener(services.provider.EVENTS.CONNECTED, this.onConnect.bind(this))
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.auctionPhases) {
      const claimStartsAt = this.props.auctionPhases[2] * 1000
      const claimEndsAt = this.props.auctionPhases[3] * 1000
      const now = parseInt(Date.now())
      if (now >= claimStartsAt && now < claimEndsAt && !this.state.hasLoadedWinningBids) {
        this.props.loadWinningBids()
        this.setState({
          hasLoadedWinningBids: true
        })
      }
    }
  }

  renderNoBids() {
    return (
      <>
        <div className='mt-4 mb-4 text-lg text-center font-bold'>{'My Bids'}</div>
        <div className='max-w-md m-auto'>
          <div className='mb-8'>
            <components.labels.Information text={"You haven't placed any bids"} />
          </div>
          <components.DomainSearch />
        </div>
      </>
    )
  }

  renderOver() {
    return (
      <div className='max-w-screen-md m-auto mt-4'>
        <div className='text-center font-bold text-lg'>{'The Sunrise Auction is over'}</div>
        <div className='text-center'>{'You may now register any domains that are still available.'}</div>
        <div className='max-w-sm m-auto mt-8'>
          <components.buttons.Button text={'View My Domains'} onClick={(navigator) => services.linking.navigate(navigator, 'MyDomains')} />
        </div>
        <div className='max-w-sm m-auto mt-4'>
          <components.DomainSearch />
        </div>
      </div>
    )
  }

  renderClaim() {
    const claimEndsAt = this.props.auctionPhases[3] * 1000
    const later = Date.now() + 60 * 60 * 365 * 2000000
    const isSubmitted = (name) => this.props.unsubmittedBidNames.indexOf(name) === -1
    const isRevealed = (name) => {
      if (this.props.revealedBidNames.indexOf(name) > -1) return true
      if (this.props.reverseLookups[name]) return true
      return false
    }
    const bids = this.props.bids
    const keys = Object.keys(bids).sort().filter(name => isSubmitted(name))
    const nameData = this.props.nameData

    if (this.props.loadedBidProgress < 100) return (
      <div className='text-gray-400 mt-8 max-w-sm m-auto text-center'>
        <div className='mb-4 '>Loading Bids</div>
        <components.ProgressBar progress={this.props.loadedBidProgress} />
      </div>
    )

    let bidTotal = ethers.BigNumber.from('0') // total to pay to claim all
    let fullBidTotal = ethers.BigNumber.from('0') // total of all bids
    let registrationTotal = ethers.BigNumber.from('0')
    let hasAllKeys = true
    let allClaimed = true
    let anyRevealed = false
    let auctionResults = this.props.auctionResults
    let canClaim = false
    let toClaim = 0
    let missingEnhanced = 0
    let allBids = []

    this.props.revealedBids.forEach((bid, index) => {
      let key = bid.preimage
      if (key === null) {
        if (this.props.reverseLookups[bid.name.toString()]) {
          key = this.props.reverseLookups[bid.name.toString()]
        } else {
          missingEnhanced += 1
          return
        }
      }
      allBids.push(Object.assign(bid, {
        preimage: key
      }))
      if (!nameData[key]) {
        hasAllKeys = false
        return
      }
      if (this.props.winningBidsLoaded && this.state.isConnected && auctionResults) {
        fullBidTotal = fullBidTotal.add(ethers.BigNumber.from(bid.amount))
        if (auctionResults[key] && auctionResults[key].isWinner) {
          bidTotal = bidTotal.add(ethers.BigNumber.from(auctionResults[key].auctionPrice))
          registrationTotal = registrationTotal.add(ethers.BigNumber.from(nameData[key].priceUSDCents))
          if (auctionResults[key].type !== 'IS_CLAIMED') {
            canClaim = true
            toClaim += 1
          }
        }
      } else {
        bidTotal = bidTotal.add(ethers.BigNumber.from(bids[key]))
        registrationTotal = registrationTotal.add(ethers.BigNumber.from(nameData[key].priceUSDCents))
      }
      if (isRevealed(key)) anyRevealed = true
      if (!nameData[key]) {
        hasAllKeys = false
        return
      }
      if (
        this.props.claimedNames 
        && !this.props.claimedNames[key] 
        && auctionResults[key] 
        && auctionResults[key].type !== 'IS_CLAIMED'
        && auctionResults[key].isWinner
      ) allClaimed = false
    })

    if (!hasAllKeys) return null

    if (this.props.revealedBids.length === 0) return (
      <>
        <div className='mt-4 mb-4 text-lg text-center font-bold'>{'Sunrise Auction - Claim'}</div>
        <div className='max-w-md m-auto'>
          <div className='mt-4 text-gray-700 dark:text-gray-400'>
            {"During this phase, users can check on their Revealed Bids, and they can claim any auctions that t hey have won."}
          </div>
          <div className='font-bold mt-4'>
            {"No Revealed Bids were found."}
          </div>
          <div className='mt-4 text-gray-700 dark:text-gray-400'>
            {"Revealed Bids are stored on-chain. If you do not see them here, then the wallet you have connected did not have any valid, revealed bids in the Sunrise Auction."}
          </div>
          <div className='font-bold mt-4'>
            {"I placed a bid. Why don't I see it?"}
          </div>
          <div className='mt-4 text-gray-700 dark:text-gray-400'>
            {"In order to see a bid here, you must have successfully completed the Bid Placement and Bid Reveal phases. If you failed to place your bid or failed to reveal your bid, the process was not successful."}
          </div>
          <div className='font-bold mt-4'>
            {"What can I do now?"}
          </div>
          <div className='mt-4 text-gray-700 dark:text-gray-400'>
            {"Once the auction is over, you will be able to register domains. Please return when the auction has completed."} <Link className='text-alert-blue' to={services.linking.path('SunriseAuction')}>{'Auction dates are available in the Sunrise Auction description.'}</Link>
          </div>
        </div>
      </>
    )

    let _keys
    let _hasPages = false
    let pageLength = 5
    let _numPages = allBids.length / pageLength
    if (allBids.length > pageLength) {
      _keys = allBids.slice(this.state.paginationIndex * pageLength, this.state.paginationIndex * pageLength + pageLength)
      _hasPages = true
    } else {
      _keys = allBids
    }

    return (
      <>
        <components.Modal show={this.props.claimGenerateProofs.length > 0} ref={(ref) => {
          this.claimProofModal = ref
        }} onClose={() => this.props.setClaimGenerateProofs([])}> 
          {this.props.claimGenerateProofs.length > 0 ? (
            <ClaimProofFlow
              onComplete={() => {
                this.claimProofModal.toggle()
              }} 
            />
          ) : null}
        </components.Modal>
        <div className='md:flex md:mt-2 md:mx-4'>
          <div className='w-full md:mr-8'>
            <div>
              <div className='mt-4 text-lg text-center font-bold md:text-left md:mt-0 md:text-xl'>{'My Bids - Claim'}</div>
              <div className='text-md text-left text-gray-500 mb-4 max-w-sm m-auto md:text-left md:m-0'>{'During this stage you must claim the auctions you have won.'}</div>
              <div className='mb-8 mt-4'></div>
            </div>
            {missingEnhanced > 0 ? (
              <div>
                <components.labels.Error text={`You have ${missingEnhanced} Enhanced Privacy ${missingEnhanced === 1 ? 'domain' : 'domains'} which ${missingEnhanced === 1 ? 'is' : 'are'} hidden. To claim ${missingEnhanced === 1 ? 'it' : 'them'}, you must reveal ${missingEnhanced === 1 ? 'it' : 'them'}.`} />
                <div className='mt-4'>
                  <components.DomainReveal onReveal={(revealed) => {
                    this.props.loadWinningBids(true)
                  }} />
                </div>
              </div>
            ) : null}
            <div className='mb-8'>
              {this.state.isConnected ? null : (
                <>
                  <components.labels.error text={'connect your wallet to see auction results & claim domains'} justify='justify-flex-start' />
                  <div classname='mt-4 max-w-sm md:hidden'>
                    <components.buttons.button text={'connect wallet'} />
                  </div>
                </>
              )}
            </div>
            {_keys.map((bid, index) => {
              let key = bid.preimage
              const result = this.props.auctionResults[key]
              if (!result) return null
              if (!this.props.nameData) return null
              const isOwned = this.props.nameData[key].status === 'REGISTERED_SELF'
              return (
                <div className='bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4' key={index}>
                  <div className='font-bold'>{key}</div>
                  <div className=''>Your Bid: {services.money.renderWAVAX(bid.amount)}</div>
                  {result.isWinner ? (
                    <div className=''>Cost to Claim: {services.money.renderWAVAX(auctionResults[key].auctionPrice)}</div>
                  ) : null}
                  <div className=''>Yearly registration fee: {services.money.renderUSD(nameData[key].priceUSDCents)}</div>
                  {this.state.isConnected ? (
                    <div className='flex mt-2'>
                      <div className='mr-2'>
                        {result.type === 'NO_WINNER' ? (
                          <components.labels.Error text={'No participants have enough WAVAX to claim'} size={'xs'} />
                        ) : this.props.claimedNames[key] || isOwned ? (
                          <components.labels.Success text={'You have claimed this name'} />
                        ) : result.type === 'IS_CLAIMED' ? (
                          <components.labels.Error text={'You lost this auction'} />
                        ) : result.isWinner ? (
                          <components.labels.Information text={'You have won this auction'} />
                        ) : (
                          <components.labels.Error text={'You lost this auction'} />
                        )}
                      </div>
                    </div>
                  ) : null}
                  {result.isWinner && result.type !== 'IS_CLAIMED' ? (

                    <div className='w-32 mt-4'>
                      <components.buttons.Button sm={true} text={'Claim'} onClick={() => this.props.claim(key)} loading={this.props.isClaimingDomain[key]} />
                    </div>
                  ) : null}
                </div>
              )
            })}
            {_hasPages ? this.renderPagination(_numPages) : null}
          </div>
          <div className='max-w-sm w-full m-auto mt-8 md:flex-shrink-0 md:ml-4 md:pl-4 md:mt-0'>
            <div className='md:bg-gray-100 md:dark:bg-gray-800 md:rounded-lg md:p-4'>
              <Summary.FullSummary  
                subtitle={this.props.winningBidsLoaded && this.state.isConnected ? '(Totals for auctions that you won)' : null}
                bidTotal={fullBidTotal} 
                costToClaim={bidTotal}
                registrationTotal={registrationTotal} 
                showAvailable={!(this.state.isConnected && allClaimed)} 
                notConnectedLabel={'Connect your wallet to see auction results & claim domains'}
              />
              {this.state.isConnected ? (
                <>
                  <div className='mt-8'>
                    <div className='font-bold text-center mb-4 text-lg'>{"Next auction phase:"}</div>
                    <AuctionPhase name='Auction over' startsAt={claimEndsAt} endsAt={later} />
                  </div>
                  <div className='mt-4 max-w-sm m-auto'>
                    {allClaimed ? (
                      <>
                        <div className='mb-4'>
                          {'You must return after the auction is over to renew your domains or they will expire.'}
                        </div>
                        <components.labels.Success text={'You have claimed all of the auctions you won. Congratulations!'} />
                        <div className='mt-4'>
                          <components.buttons.Button text={'View Domains'} onClick={(navigator) => services.linking.navigate(navigator, 'MyDomains')} />
                        </div>
                      </>
                    ) : canClaim ? (
                      <>
                        <div className='mb-4 text-center'>You have {toClaim} {toClaim === 1 ? 'domain' : 'domains'} to claim.{toClaim > 12 ? ' You can only claim 12 per transaction.' : ''}</div>
                        <components.buttons.Button text={toClaim > 12 ? 'Claim Next 12 Domains' : 'Claim All'} onClick={() => this.props.claimAll()} loading={this.props.isClaimingDomains} />
                      </>
                    ) : null}
                  </div>
                </>
              ) : null}
            </div>
            {this.renderDocumentation()}
          </div>
        </div>
      </>
    )
  }


  renderBidReveal() {
    const claimStartsAt = this.props.auctionPhases[2] * 1000
    const claimEndsAt = this.props.auctionPhases[3] * 1000
    const isSubmitted = (name) => this.props.unsubmittedBidNames.indexOf(name) === -1
    const isRevealed = (name) => this.props.revealedBidNames.indexOf(name) > -1
    const bids = this.props.bids
    const keys = Object.keys(bids).sort().filter(name => isSubmitted(name))
    const allRevealed = keys.reduce((sum, curr) => {
      if (!sum) return false
      if (!isRevealed(curr)) return false
      return true
    }, true)
    const nameData = this.props.nameData
    let bidTotal = ethers.BigNumber.from('0')
    let registrationTotal = ethers.BigNumber.from('0')
    let hasAllKeys = true
    keys.forEach(key => {
      bidTotal = bidTotal.add(ethers.BigNumber.from(bids[key]))
      if (!nameData[key]) {
        hasAllKeys = false
        return
      }
      registrationTotal = registrationTotal.add(ethers.BigNumber.from(nameData[key].priceUSDCents))
    })

    if (!hasAllKeys) return null

    if (keys.length === 0) return (
      <>
        <div className='mt-4 mb-4 text-lg text-center font-bold'>{'Sunrise Auction - Bid Reveal'}</div>
        <div className='max-w-md m-auto'>
          <div className='mt-4 text-gray-700 dark:text-gray-400'>
            {"During this phase, no new bids can be placed. Users who have already placed sealed bids must reveal the contents of their sealed bids."}
          </div>
          <div className='font-bold mt-4'>
            {"No bids found."}
          </div>
          <div className='mt-4 text-gray-700 dark:text-gray-400'>
            {"We did not find any bids on your device. If you did not place a bid during the Bid Placement phase, you cannot place a bid now."}
          </div>
          <div className='font-bold mt-4'>
            {"Did you place a bid during the Bid Placement phase?"}
          </div>
          <div className='mt-4 text-gray-700 dark:text-gray-400'>
            {"During the Bid Placement phase, you submit a sealed bid to the C-Chain and your bid details are kept on your device. After you submit the sealed bid, you are forced to download a backup file "}<span className='italic'>{'avvy-backup.json'}</span>{". If you are able to find that file, "}<Link className='text-alert-blue' to={services.linking.path('Settings')}>{'you can restore it in your settings'}</Link>{"."}<br /><br />{"If you are able to access the device you used for Bid Placement, your data may be on that device. If you are unable to locate the data to reveal your bid, your bid will be disqualified."}
          </div>
          <div className='font-bold mt-4'>
            {"What can I do now?"}
          </div>
          <div className='mt-4 text-gray-700 dark:text-gray-400'>
            {"Once the auction is over, you will be able to register domains. Please return when the auction has completed."}<Link className='text-alert-blue' to={services.linking.path('SunriseAuction')}>{'Auction dates are available in the Sunrise Auction description.'}</Link>
          </div>
        </div>
      </>
    )

    let _keys
    let _hasPages = false
    let pageLength = 5
    let _numPages = keys.length / pageLength
    if (keys.length > pageLength) {
      _keys = keys.slice(this.state.paginationIndex * pageLength, this.state.paginationIndex * pageLength + pageLength)
      _hasPages = true
    } else {
      _keys = keys
    }

    return (
      <>
        <components.Modal ref={(ref) => {
          this.revealModal = ref
        }} onClose={() => {
          if (this.disableRevealModalWarning) return true
          const answer = window.confirm('Closing this window will abandon your bid reveal. Are you sure you want to proceed?')
          return answer
        }}> 
          <RevealFlow onComplete={() => {
            this.disableRevealModalWarning = true
            this.revealModal.toggle()
            this.disableRevealModalWarning = false
          }} bidTotal={bidTotal} registrationTotal={registrationTotal} />
        </components.Modal>
        <div className='md:flex md:mt-2 md:mx-4'>
          <div className='w-full md:mr-8'>
            <div>
              <div className='mt-4 text-lg text-center font-bold md:text-left md:mt-0 md:text-xl'>{'My Bids - Bid Reveal'}</div>
              <div className='text-md text-left text-gray-500 mb-4 max-w-sm m-auto md:text-left md:m-0'>{'During this stage you must reveal your submitted bids & authorize payment in WAVAX.'}</div>
              <div className='mb-8 mt-4'></div>
            </div>
            <div className='mb-8'>
              {allRevealed ? (
                <components.labels.Success text={'All of your bids have been revealed.'} justify='justify-flex-start' />
              ) : (
                <components.labels.Information text={'Some of your bids are not revealed.'} justify='justify-flex-start' />
              )}
            </div>
            {_keys.map((key, index) => {
              const _isRevealed = isRevealed(key)
              return (
                <div className='bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4' key={index}>
                  <div className='font-bold'>{key}</div>
                  <div className=''>Your Bid: {services.money.renderWAVAX(bids[key])}</div>
                  <div className=''>Yearly registration fee: {services.money.renderUSD(nameData[key].priceUSDCents)}</div>
                  <div className='flex mt-2'>
                    <div className='mr-2'>
                      {_isRevealed ? (
                        <components.labels.Success text={'Bid revealed'} />
                      ) : (
                        <components.labels.Error text={'Bid not revealed'} />
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
            {_hasPages ? this.renderPagination(_numPages) : null}
          </div>
          <div className='max-w-sm w-full m-auto mt-8 md:flex-shrink-0 md:ml-4 md:pl-4 md:mt-0'>
            <div className='md:bg-gray-100 md:dark:bg-gray-800 md:rounded-lg md:p-4'>
              <div className='mb-8'>
                <Summary.FullSummary fullBidTotal={bidTotal} bidTotal={bidTotal} registrationTotal={registrationTotal} showAvailable={allRevealed} />
              </div>
              {allRevealed ? 
                <div>
                  <div className='font-bold text-center mb-4 text-lg'>{"Next auction phase:"}</div>
                  <AuctionPhase name='Claim' startsAt={claimStartsAt} endsAt={claimEndsAt} />
                </div>
              : (
                <components.buttons.Button text={'Reveal Bids'} onClick={() => this.revealModal.toggle()} />
              )}
            </div>
            {this.renderDocumentation()}
          </div>
        </div>
      </>
    )
  }

  renderPagination(numPages) {
    numPages = Math.ceil(numPages)
    const currPage = this.state.paginationIndex
    let pagesDisplayed = []
    const maxPagesToDisplay = 5
    if (currPage === 0 || currPage === 1) {
      for (let i = 0; i < numPages; i += 1) {
        pagesDisplayed.push(i+1)
        if (pagesDisplayed.length >= maxPagesToDisplay) break
      }
    } else if (currPage === numPages - 1 || currPage === numPages - 2) {
      for (let i = numPages - 5; i < numPages; i += 1) {
        if (i + 1 > 0) {
          pagesDisplayed.push(i+1)
        }
        if (pagesDisplayed.length >= maxPagesToDisplay) break
      }
    } else {
      pagesDisplayed = [
        currPage - 1,
        currPage,
        currPage + 1,
        currPage + 2,
        currPage + 3,
      ]
    }
    return (
      <div className='flex items-center justify-center'>
        <div 
          onClick={() => {
            this.setState(currState => {
              const currPage = this.state.paginationIndex
              const nextPage = currPage === 0 ? currPage : currPage - 1
              return {
                paginationIndex: nextPage
              }
            })
          }}
          className='dark:bg-gray-800 bg-gray-100 rounded-lg select-none w-12 h-12 flex items-center justify-center mr-2 cursor-pointer'>
          <ChevronLeftIcon className='w-6' />
        </div>
        {pagesDisplayed.map((p, index) => (
          <div 
            onClick={() => {
              this.setState({
                paginationIndex: p - 1
              })
            }}
            className={`dark:bg-gray-800 cursor-pointer select-none bg-gray-100 rounded-lg w-12 h-12 flex items-center justify-center mr-2 ${currPage === p - 1 ? 'font-bold' : ''}`} key={index}>{p}
          </div>
        ))}
        <div 
          onClick={() => {
            this.setState(currState => {
              const currPage = this.state.paginationIndex
              const nextPage = currPage >= numPages - 1 ? currPage : currPage + 1
              return {
                paginationIndex: nextPage
              }
            })
          }}
          className='dark:bg-gray-800 bg-gray-100 rounded-lg select-none w-12 h-12 flex items-center justify-center mr-2 cursor-pointer'>
          <ChevronRightIcon className='w-6' />
        </div>
      </div>
    )
  }

  renderDocumentation() {
    return (
      <a href="https://avvy.domains/docs/sunrise-auction" target="_blank">
        <div className='cursor-pointer flex items-center justify-between bg-gray-100 rounded-lg p-4 font-bold dark:bg-gray-800 mt-4'>
          <div>{'Auction Documentation'}</div>
          <ExternalLinkIcon className="h-6" />
        </div>
      </a>
    )
  }

  renderBidPlacement() {
    const bidRevealStartsAt = this.props.auctionPhases[1] * 1000
    const claimStartsAt = this.props.auctionPhases[2] * 1000
    const isSubmitted = (name) => this.props.unsubmittedBidNames.indexOf(name) === -1
    const bids = this.props.bids
    const keys = Object.keys(bids).sort()

    const allSubmitted = keys.reduce((sum, curr) => {
      if (!sum) return false
      if (!isSubmitted(curr)) return false
      return true
    }, true)
    const nameData = this.props.nameData
    let bidTotal = ethers.BigNumber.from('0')
    let registrationTotal = ethers.BigNumber.from('0')
    let hasAllKeys = true
    keys.forEach(key => {
      bidTotal = bidTotal.add(ethers.BigNumber.from(bids[key]))
      if (!nameData[key]) {
        hasAllKeys = false
        return
      }
      registrationTotal = registrationTotal.add(ethers.BigNumber.from(nameData[key].priceUSDCents))
    })

    if (!hasAllKeys) return null

    if (keys.length === 0) return this.renderNoBids()

    let _keys
    let _hasPages = false
    let pageLength = 5
    let _numPages = keys.length / pageLength
    if (keys.length > pageLength) {
      _keys = keys.slice(this.state.paginationIndex * pageLength, this.state.paginationIndex * pageLength + pageLength)
      _hasPages = true
    } else {
      _keys = keys
    }

    return (
      <div className='md:flex md:px-4 md:mt-2'>
        <div className='w-full md:mr-8'>
          <div className='mt-4 text-lg text-center font-bold md:text-left md:text-lg md:mt-0'>{'My Bids - Bid Placement'}</div>
          <div className='text-md text-left text-gray-500 mb-4 max-w-sm m-auto md:text-left md:m-0'>{'During this stage, you must place your sealed bids. No one will know the domain or price of your bid.'}</div>
          <div className='mb-8 mt-4'>
            {allSubmitted ? (
              <components.labels.Success text={'All of your bids have been submitted.'} justify='justify-flex-start' />
            ) : (
              <components.labels.Information text={'Some of your bids are not submitted.'} justify='justify-flex-start' />
            )}
          </div>
          <components.Modal ref={(ref) => {
            this.bidModal = ref
          }} onClose={() => {
            if (this.disableBidModalWarning) return true
            const answer = window.confirm('Closing this window will abandon your bid placement. Are you sure you want to proceed?')
            return answer
          }}> 
            <BidFlow onComplete={() => {
              this.disableBidModalWarning = true
              this.props.resetBidFlow()
              this.bidModal.toggle()
              this.disableBidModalWarning = false
            }} />
          </components.Modal>
          {_keys.map((key, index) => {
            const _isSubmitted = isSubmitted(key)
            return (
              <div className='bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4' key={index}>
                <div className='font-bold'>{key}</div>
                <div className=''>Your Bid: {services.money.renderWAVAX(bids[key])}</div>
                <div className=''>Yearly registration fee: {services.money.renderUSD(nameData[key].priceUSDCents)}</div>
                <div className='flex mt-2'>
                  <div className='mr-2'>
                    {_isSubmitted ? (
                      <components.labels.Success text={'Bid submitted'} size={'xs'} />
                    ) : (
                      <components.labels.Error text={'Bid not submitted'} size={'xs'} />
                    )}
                  </div>
                  {_isSubmitted ? null : (
                    <div className='flex items-end cursor-pointer' onClick={() => this.props.deleteBid(key)}>
                      <TrashIcon className='w-4' />
                      <div className='font-bold text-xs ml-1'>{"Delete"}</div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
          {_hasPages ? this.renderPagination(_numPages) : null}
        </div>
        <div className='max-w-sm w-full m-auto mt-8 md:flex-shrink-0 md:ml-4 md:pl-4 md:mt-0'>
          <div className='md:bg-gray-100 md:dark:bg-gray-800 md:rounded-lg md:p-4'>
            <div className='mb-8'>
              <Summary.FullSummary bidTotal={bidTotal} registrationTotal={registrationTotal} />
            </div>
            {allSubmitted ? (
              <div>
                <div className='font-bold text-center mb-4 text-lg'>{"Next auction phase:"}</div>
                <AuctionPhase name='Bid reveal' startsAt={bidRevealStartsAt} endsAt={claimStartsAt} />
              </div>
            ) : (
              <components.buttons.Button text={'Place Bids'} onClick={() => this.bidModal.toggle()} />
            )}
          </div>
          {this.renderDocumentation()}
        </div>
      </div>
    )
  }

  renderConnect() {
    return ( 
      <div className='max-w-screen-md m-auto'>
        <components.Modal ref={(ref) => this.connectModal = ref} title={'Connect your wallet'}> 
          <components.ConnectWallet />
        </components.Modal>
        <div className='mt-4 mb-4 text-lg text-center font-bold'>{"My Bids"}</div>
        <div className='max-w-md m-auto'>
          <components.labels.Information text={'You must be connected to a wallet to view your bids'} />
          <div className='mt-8'>
            <components.buttons.Button text={'Connect your wallet'} onClick={() => this.connectModal.toggle()} />
          </div>
        </div>
      </div>
    )
  }

  renderLoading() {
    return (
      <div className='text-center w-full mt-8'>
        <components.Spinner size='md' color={this.props.isDarkmode ? '#eee' : '#555'} />
      </div>
    )
  }

  render() {
    if (!this.props.auctionPhases) return this.renderLoading()
    if (!this.state.isConnected) return this.renderConnect()
    const bidPlacementStartsAt = this.props.auctionPhases[0] * 1000
    const bidRevealStartsAt = this.props.auctionPhases[1] * 1000
    const claimStartsAt = this.props.auctionPhases[2] * 1000
    const claimEndsAt = this.props.auctionPhases[3] * 1000
    const now = parseInt(Date.now())
    if (now >= bidPlacementStartsAt && now < bidRevealStartsAt) return this.renderBidPlacement()
    if (now >= bidRevealStartsAt && now < claimStartsAt) return this.renderBidReveal()
    if (now >= claimStartsAt && now < claimEndsAt) return this.renderClaim()
    return this.renderOver()
  }
}

const mapStateToProps = (state) => ({
  bids: services.sunrise.selectors.bids(state),
  nameData: services.sunrise.selectors.nameData(state),
  auctionPhases: selectors.auctionPhases(state),
  unsubmittedBidNames: services.sunrise.selectors.unsubmittedBidNames(state),
  revealedBidNames: services.sunrise.selectors.revealedBidNames(state),
  auctionResults: selectors.auctionResults(state),
  isClaimingDomains: selectors.isClaimingDomains(state),
  isClaimingDomain: selectors.isClaimingDomain(state),
  claimedNames: services.sunrise.selectors.claimedNames(state),
  winningBidsLoaded: selectors.winningBidsLoaded(state),
  isDarkmode: services.darkmode.selectors.isDarkmode(state),
  revealedBids: selectors.revealedBids(state),
  claimGenerateProofs: selectors.claimGenerateProofs(state),
  loadedBidProgress: selectors.loadedBidProgress(state),
  reverseLookups: services.names.selectors.reverseLookups(state),
})

const mapDispatchToProps = (dispatch) => ({
  loadAuctionPhases: () => dispatch(actions.loadAuctionPhases()),
  deleteBid: (key) => dispatch(services.sunrise.actions.deleteBid(key)),
  loadWinningBids: (force) => dispatch(actions.loadWinningBids(force)),
  claimAll: () => dispatch(actions.claimAll()),
  claim: (key) => dispatch(actions.claim(key)),
  resetBidFlow: () => dispatch(actions.resetBidding()),
  setClaimGenerateProofs: (names) => dispatch(actions.setClaimGenerateProofs(names)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MyBids)
