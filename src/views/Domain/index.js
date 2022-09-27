import React from 'react'
import { connect } from 'react-redux'
import {
  CheckCircleIcon,
  PlusCircleIcon,
  ExternalLinkIcon,
} from '@heroicons/react/solid'
import { InformationCircleIcon, PlusIcon } from '@heroicons/react/outline'
import { ethers } from 'ethers'

import services from 'services'
import components from 'components'

import AddBid from './AddBid'
import SetEVMReverseRecord from './SetEVMReverseRecord'
import SetRecord from './SetRecord'
import SetResolver from './SetResolver'
import TransferDomain from './TransferDomain'
import actions from './actions'
import constants from './constants'
import reducer from './reducer'
import selectors from './selectors'

class Domain extends React.PureComponent {
  constructor(props) {
    super(props)
    const params = services.linking.getParams('Domain')
    const domain = params.domain ? params.domain.toLowerCase() : null
    this.state = {
      domain: domain,
      connected: services.provider.isConnected(),
      setRecordReset: 0, // increment this to reset the form
      defaultResolver: undefined,
      dataExplorer: null,
      editRecordKey: null,
      deleteRecordKey: null,
    }
    this.searchPlaceholder = 'Search for another name'
    this.loadDomain(domain)
    this.getFNS()
  }

  async getFNS() {
    const api = await services.provider.buildAPI()
    this.fns = api.fns
  }

  async setDefaultResolver() {
    const api = await services.provider.buildAPI()
    this.setState({
      defaultResolver: api.getDefaultResolverAddress(),
    })
  }

  updateParams() {
    const params = services.linking.getParams('Domain')
    const domain = params.domain ? params.domain.toLowerCase() : null
    this.setState(() => {
      this.loadDomain(domain)
      return {
        domain: domain,
      }
    })
  }

  loadDomain() {
    const params = services.linking.getParams('Domain')
    const domain = params.domain ? params.domain.toLowerCase() : null
    this.props.loadDomain(domain)
    this.props.loadRegistrationPremium()
  }

  onConnect() {
    this.setState({
      connected: true,
    })
    if (this.connectModal) this.connectModal.hide()
    this.loadDomain()
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.setRecordComplete && this.props.setRecordComplete) {
      this.setRecordModal.toggle()
      this.props.resetSetRecord()
    }
  }

  setApi = async () => {
    this.api = await services.provider.buildAPI()
  }

  componentDidMount() {
    services.linking.addEventListener('Domain', this.updateParams.bind(this))
    services.provider.addEventListener(
      services.provider.EVENTS.CONNECTED,
      this.onConnect.bind(this),
    )
    this.setDefaultResolver()
    this.setApi()
  }

  componentWillUnmount() {
    services.linking.removeEventListener('Domain', this.updateParams.bind(this))
    services.provider.addEventListener(
      services.provider.EVENTS.CONNECTED,
      this.onConnect.bind(this),
    )
  }

  addToCart = (navigator) => {
    this.props.addToCart(this.state.domain)
    services.linking.navigate(navigator, 'Register', {})
  }

  bidOnName = () => {
    this.bidModal.toggle()
  }

  setResolver = () => {
    this.props.resetSetResolver()
    this.setResolverModal.toggle()
  }

  handleAddBid = (navigate, value) => {
    this.props.addBid(this.state.domain, value)
    services.linking.navigate(navigate, 'SunriseAuctionMyBids')
  }

  _handleSetRecord = (type, value) => {
    this.props.setStandardRecord(this.state.domain, type, value)
  }

  showSetRecord = (key, value) => {
    this.setState((currState) => ({
      editRecordKey: key,
      deleteRecordKey: null,
    }))
    if (!value) value = ''
    this.setRecord.setValue(value)
    this.toogleRecordModal()
  }

  showDeleteRecord = (key, value) => {
    this.setState((currState) => ({
      editRecordKey: null,
      deleteRecordKey: key,
    }))
    if (!value) value = ''
    this.toogleRecordModal()
  }

  toogleRecordModal = () => {
    console.log(this.state)
    this.setRecordModal.toggle()
  }

  setRecords = () => {
    console.log('starting records: ')
    const records = []
    this.fns?.RECORDS._LIST.map((record, index) => {
      const recs = this.props.records.filter(
        (rec) => rec.label === record.label,
      )
      if (recs.length > 0) {
        record.value = recs[0].value
        console.log(record)

        records.push(record)
      } else {
        records.push(record)
      }
    })

    this.setState((currState) => ({
      records: records,
    }))
  }
  renderAvailableBody() {
    return (
      <div className="max-w-md m-auto">
        <div className="max-w-sm m-auto mt-4 flex items-center justify-center">
          <CheckCircleIcon className="w-6 text-alert-blue mr-2" />
          <div className="text-alert-blue">{'Available for registration'}</div>
        </div>
        {this.props.registrationPremium?.gt(ethers.BigNumber.from('0')) ? (
          <div className="mt-4 border-2 rounded-lg border-gray-100 dark:border-gray-700 p-4">
            <div className="font-bold">Registration Premium</div>
            <div>
              {
                'The .ftm namespace is currently launching. Names can be acquired, but a one-time Registration Premium must be paid in FTM. This Registration Premium decreases as time passes, eventually reaching 0.'
              }
            </div>
            <div className="mt-4 underline">
              <a href="https://fns.domains/auction-guide/" target="_blank">
                Read more about Registration Premiums
              </a>
            </div>
            <div className="mt-4">
              Current Premium:{' '}
              <span className="font-bold">
                {services.money.renderFTM(this.props.registrationPremium)}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-4"></div>
        )}
        {services.environment.REGISTRATIONS_ENABLED ? (
          <div className="mt-4">
            <components.buttons.Button
              text={'Register this name'}
              onClick={(navigator) => this.addToCart(navigator)}
            />
          </div>
        ) : null}
        <div className="mt-4">
          <components.DomainSearch placeholder={this.searchPlaceholder} />
        </div>
      </div>
    )
  }

  renderAuctionAvailableBody() {
    const hasBid = this.props.bids && this.props.bids[this.state.domain]
    return (
      <div className="max-w-md m-auto">
        {hasBid ? (
          <>
            <components.labels.Success text="You have placed a bid on this name" />
            <div className="mt-8">
              <components.buttons.Button
                text={'View my bids'}
                onClick={(navigator) =>
                  services.linking.navigate(navigator, 'SunriseAuctionMyBids')
                }
              />
            </div>
          </>
        ) : (
          <>
            <components.labels.Success text="Available for auction" />
            <div className="mt-8">
              <components.buttons.Button
                text={'Bid on this name'}
                onClick={this.bidOnName.bind(this)}
              />
            </div>
          </>
        )}
        <div className="mt-4">
          <components.DomainSearch placeholder={this.searchPlaceholder} />
        </div>
      </div>
    )
  }

  renderAuctionBiddingClosedBody() {
    return (
      <div className="max-w-md m-auto">
        <div className="max-w-sm m-auto mt-4">
          <components.labels.Information text={'This name is up for auction'} />
        </div>
        <div className="mt-4 bg-gray-100 rounded-xl w-full relative p-8 dark:bg-gray-700">
          <div className="font-bold">{'Bidding period is over'}</div>
          <div>
            {
              'This name is undergoing the Sunrise Auction process, however bidding is closed. If there are no winning bids, this name will be available for registration after the auction completes.'
            }
          </div>
        </div>
        <div className="mt-4">
          <components.DomainSearch placeholder={this.searchPlaceholder} />
        </div>
      </div>
    )
  }

  renderUnsupported() {
    return (
      <div className="max-w-md m-auto">
        <div className="max-w-sm m-auto mt-4 flex items-center justify-center">
          <components.labels.Error text={'This name cannot be registered'} />
        </div>
        <div className="mt-4">
          <components.DomainSearch placeholder={this.searchPlaceholder} />
        </div>
      </div>
    )
  }

  renderRegistered() {
    let account = services.provider.getAccount()
    const isOwned = account
      ? account.toLowerCase() === this.props.domain.owner.toLowerCase()
      : false
    const isExpired = Date.now() >= this.props.domain.expiresAt * 1000
    const hasLoadedPrivacy =
      !!this.props.isRevealed &&
      this.props.isRevealed[this.props.domain.hash] != undefined
    if (!this.fns) return

    return (
      <div className="max-w-screen-md m-auto flex w-full md:flex-row md:items-start">
        <components.Modal ref={(ref) => (this.dataExplorerModal = ref)}>
          <components.DataExplorer data={this.state.dataExplorer} />
        </components.Modal>
        <components.Modal
          title={'Set C-Chain / EVM Reverse Record'}
          ref={(ref) => (this.setEVMReverseRecordModal = ref)}
        >
          <SetEVMReverseRecord
            domain={this.state.domain}
            onComplete={() => {
              this.setEVMReverseRecordModal.toggle()
            }}
          />
        </components.Modal>
        <components.Modal
          title={'Transfer Domain'}
          ref={(ref) => (this.transferDomainModal = ref)}
        >
          <TransferDomain
            onComplete={() => {
              this.loadDomain()
              this.transferDomainModal.toggle()
            }}
            domain={this.state.domain}
          />
        </components.Modal>
        <components.Modal
          title={
            this.state.deleteRecordKey
              ? 'Delete Record'
              : this.state.editRecordKey
              ? 'Edit Record'
              : 'Add Record'
          }
          ref={(ref) => (this.setRecordModal = ref)}
        >
          <SetRecord
            deleteRecord={this.state.deleteRecordKey}
            editRecord={this.state.editRecordKey}
            handleSubmit={this._handleSetRecord}
            loading={this.props.isSettingRecord}
            api={this.api}
            ref={(ref) => (this.setRecord = ref)}
          />
        </components.Modal>
        <components.Modal
          title={'Set Resolver'}
          ref={(ref) => (this.setResolverModal = ref)}
        >
          <SetResolver
            onComplete={() => this.setResolverModal.toggle()}
            domain={this.state.domain}
            resolver={this.props.resolver}
          />
        </components.Modal>
        <components.Modal
          title={'Switch to Standard Privacy'}
          ref={(ref) => (this.revealDomainModal = ref)}
        >
          {this.props.isRevealComplete ? (
            <div className="max-w-md m-auto">
              <div className="my-8">
                <components.labels.Success
                  text={'Your domain has been switched to Standard Privacy'}
                />
              </div>
              <div className="">
                <components.buttons.Button
                  text={'Close'}
                  onClick={() => this.revealDomainModal.toggle()}
                />
              </div>
            </div>
          ) : (
            <div className="max-w-md m-auto text-gray-700">
              <components.labels.Warning
                text={
                  'Switching to Standard Privacy reveals your domain name on-chain. This action cannot be reversed.'
                }
              />
              <a
                className="flex items-center justify-center my-4 bg-gray-100 dark:bg-gray-800 dark:text-white p-4 rounded-lg text-center"
                href="https://fns.domains/docs/privacy-features-registrations/"
                target="_blank"
              >
                Read about privacy features{' '}
                <ExternalLinkIcon className="ml-4 text-gray-400 dark:text-gray-100 w-6" />
              </a>
              <components.buttons.Button
                text="Switch to Standard Privacy"
                onClick={() => this.props.revealDomain(this.state.domain)}
                loading={this.props.isRevealingDomain}
              />
            </div>
          )}
        </components.Modal>
        <components.Modal
          title={'Connect your wallet'}
          ref={(ref) => (this.connectModal = ref)}
        >
          <components.ConnectWallet />
        </components.Modal>
        <components.Modal ref={(ref) => (this.browserModal = ref)}>
          <div className="font-bold"></div>
          <components.UpcomingNews explorer={true} />
        </components.Modal>
        <div className="w-full">
          {/* Basic Information */}
          <div className="mt-4 bg-gray-100 rounded-xl w-full relative p-4 md:p-8 dark:bg-gray-800 w-full">
            <div className="flex justify-between items-center">
              <div className="font-bold">{'Basic Information'}</div>
              {!this.state.connected ? (
                <components.buttons.Button
                  sm={true}
                  text="Connect"
                  onClick={() => this.connectModal.toggle()}
                />
              ) : null}
            </div>
            <div
              className="w-full bg-gray-300 dark:bg-gray-700 mt-4"
              style={{ height: '1px' }}
            ></div>
            <div className="mt-4 text-sm">
              <div className="font-bold">{'Registrant'}</div>
              <div className="truncate flex items-center flex-wrap">
                <div
                  className="flex items-center cursor-pointer w-full sm:w-auto"
                  onClick={() => {
                    this.setState({
                      dataExplorer: {
                        title: 'View on Block Explorer',
                        data: this.props.domain.owner,
                        dataType: this.fns.RECORDS.EVM,
                      },
                    })
                    this.dataExplorerModal.toggle()
                  }}
                >
                  <div className="truncate">{this.props.domain.owner}</div>
                  <ExternalLinkIcon className="w-4 ml-2 flex-shrink-0" />
                </div>
                {this.state.connected && isOwned && !isExpired ? (
                  <components.buttons.Transparent
                    onClick={() => {
                      this.props.resetTransferDomain()
                      this.transferDomainModal.toggle()
                    }}
                  >
                    <div className="sm:ml-2 inline-block cursor-pointer text-alert-blue underline">
                      Transfer
                    </div>
                  </components.buttons.Transparent>
                ) : null}
              </div>
            </div>
            <div className="mt-4 text-sm flex items-center justify-between">
              <div>
                <div className="font-bold">{'Expiry'}</div>
                <div className="flex items-center">
                  {isExpired ? (
                    <div>Expired</div>
                  ) : (
                    <div>
                      {new Intl.DateTimeFormat(navigator.language, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      }).format(this.props.domain.expiresAt * 1000)}
                      {' at '}
                      {new Intl.DateTimeFormat(navigator.langauge, {
                        hour: 'numeric',
                        minute: 'numeric',
                      }).format(this.props.domain.expiresAt * 1000)}
                    </div>
                  )}
                  {this.state.connected &&
                  isOwned &&
                  this.props.domain.canRenew &&
                  services.environment.REGISTRATIONS_ENABLED ? (
                    <components.buttons.Transparent
                      onClick={(navigator) => {
                        this.props.renewDomain(this.props.domain.domain)
                        services.linking.navigate(navigator, 'Register')
                      }}
                    >
                      <div className="ml-2 inline-block cursor-pointer text-alert-blue underline">
                        Renew
                      </div>
                    </components.buttons.Transparent>
                  ) : null}
                </div>
              </div>
            </div>
            {hasLoadedPrivacy ? (
              <div className="mt-4 text-sm">
                <div className="font-bold">{'Privacy'}</div>
                <div className="truncate flex items-center">
                  {this.props.isRevealed[this.props.domain.hash] ? (
                    <div>Standard Privacy</div>
                  ) : (
                    <div>Enhanced Privacy</div>
                  )}
                  {this.state.connected &&
                  isOwned &&
                  !isExpired &&
                  !this.props.isRevealed[this.props.domain.hash] ? (
                    <components.buttons.Transparent
                      onClick={() => {
                        this.props.resetRevealDomain()
                        this.revealDomainModal.toggle()
                      }}
                    >
                      <div className="ml-2 inline-block cursor-pointer text-alert-blue underline">
                        Switch to Standard Privacy
                      </div>
                    </components.buttons.Transparent>
                  ) : null}
                </div>
              </div>
            ) : null}
            <div className="mt-4 text-sm">
              <div className="font-bold">{'Resolver'}</div>
              <div className="truncate flex items-center">
                {this.props.resolver ? (
                  <div>
                    {this.props.resolver.resolver === this.state.defaultResolver
                      ? 'Default Resolver'
                      : 'Unknown Resolver'}
                  </div>
                ) : (
                  <div>Not set</div>
                )}
                {this.state.connected && isOwned && !isExpired ? (
                  <components.buttons.Transparent onClick={this.setResolver}>
                    <div className="ml-2 inline-block cursor-pointer text-alert-blue underline">
                      Set Resolver
                    </div>
                  </components.buttons.Transparent>
                ) : null}
              </div>
            </div>
            <div className="mt-4 text-sm">
              <div className="font-bold">{'Primary'}</div>
              <div className="truncate flex items-center flex-wrap">
                {this.props.reverseRecords[this.fns.RECORDS.EVM] ? (
                  <div
                    className="flex items-center cursor-pointer w-full sm:w-auto"
                    onClick={() => {
                      this.setState({
                        dataExplorer: {
                          title: 'View on Block Explorer',
                          data: this.props.domain.owner,
                          dataType: this.fns.RECORDS.EVM,
                        },
                      })
                      this.dataExplorerModal.toggle()
                    }}
                  >
                    <div className="truncate">{this.props.domain.owner}</div>
                    <ExternalLinkIcon className="w-4 ml-2 flex-shrink-0" />
                  </div>
                ) : (
                  <div>Not set</div>
                )}
                {this.state.connected && isOwned && !isExpired ? (
                  <components.buttons.Transparent
                    onClick={() => {
                      this.setEVMReverseRecordModal.toggle()
                    }}
                  >
                    <div className="ml-2 inline-block cursor-pointer text-alert-blue underline">
                      Set as Primary
                    </div>
                  </components.buttons.Transparent>
                ) : null}
              </div>
            </div>
          </div>
          {/* Records */}

          <div className="mt-4 bg-gray-100 rounded-xl w-full relative p-4 md:p-8 dark:bg-gray-800 w-full">
            <div className="flex justify-between items-center">
              <div className="font-bold">
                {'Records'} ({' '}
                {this.props.resolver ? (
                  <span className="text-green-500">
                    {this.props.resolver.resolver === this.state.defaultResolver
                      ? 'Default Resolver'
                      : 'Unknown Resolver'}
                  </span>
                ) : (
                  <span className="text-red-500">
                    Set Resolver to set records
                  </span>
                )}
                )
              </div>
              {!this.state.connected ? (
                <components.buttons.Button
                  sm={true}
                  text="Connect"
                  onClick={() => this.connectModal.toggle()}
                />
              ) : null}
            </div>
            <div
              className="w-full bg-gray-300 dark:bg-gray-700 mt-4"
              style={{ height: '1px' }}
            ></div>
            {this.props.isLoadingRecords ? (
              <div className="mt-4 w-full text-center">
                <components.Spinner />
              </div>
            ) : (
              <div>
                {this.fns?.RECORDS._LIST.map((record, index) => (
                  <div className="mt-4" key={index}>
                    <div className="text-sm font-bold">{record.label}</div>
                    <div
                      className="text-sm flex items-center cursor-pointer w-full"
                      onClick={() => {
                        this.setState({
                          dataExplorer: {
                            data:
                              this.props.records.filter(
                                (rec) => rec.label === record.label,
                              ).length > 0
                                ? this.props.records.filter(
                                    (rec) => rec.label === record.label,
                                  )[0].value
                                : '',
                            dataType: record.key,
                          },
                        })
                        this.dataExplorerModal.toggle()
                      }}
                    >
                      <div className="truncate">
                        {this.props.records.filter(
                          (rec) => rec.label === record.label,
                        ).length > 0
                          ? this.props.records.filter(
                              (rec) => rec.label === record.label,
                            )[0].value
                          : 'Not Set'}
                      </div>
                      <ExternalLinkIcon className="w-4 ml-2 pb-1 flex-shrink-0" />
                      {this.state.connected && isOwned && !isExpired ? (
                        <div className="flex items-center">
                          <div
                            onClick={(e) => {
                              e.stopPropagation()
                              this.showSetRecord(
                                record.key,
                                this.props.records.filter(
                                  (rec) => rec.label === record.label,
                                ).length > 0
                                  ? this.props.records.filter(
                                      (rec) => rec.label === record.label,
                                    )[0].value
                                  : '',
                              )
                            }}
                            className="ml-2 text-alert-blue underline cursor-pointer"
                          >
                            {this.props.records.filter(
                              (rec) => rec.label === record.label,
                            ).length > 0
                              ? 'Edit'
                              : 'Set'}
                          </div>
                          {this.props.records.filter(
                            (rec) => rec.label === record.label,
                          ).length > 0 && (
                            <div
                              onClick={(e) => {
                                e.stopPropagation()
                                this.showDeleteRecord(record.key, record.value)
                              }}
                              className="ml-2 text-alert-blue underline cursor-pointer"
                            >
                              {'Delete'}
                            </div>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  renderLoader() {
    return (
      <div className="m-auto max-w-sm text-center">
        <components.Spinner className="w-6" size="md" dark={true} />
      </div>
    )
  }

  renderBody() {
    if (this.props.isLoading) return this.renderLoader()
    if (!this.props.domain) return null
    if (!this.props.domain.supported) return this.renderUnsupported()

    const statuses = this.props.domain.constants.DOMAIN_STATUSES

    switch (this.props.domain.status) {
      case statuses.AVAILABLE:
        return this.renderAvailableBody()

      case statuses.AUCTION_AVAILABLE:
        return this.renderAuctionAvailableBody()

      case statuses.AUCTION_BIDDING_CLOSED:
        return this.renderAuctionBiddingClosedBody()

      case statuses.REGISTERED_OTHER:
        return this.renderRegistered()

      case statuses.REGISTERED_SELF:
        return this.renderRegistered()

      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <components.Modal
          ref={(ref) => (this.bidModal = ref)}
          title={'Add a bid'}
        >
          {this.state.connected ? (
            <AddBid
              hasSeenBidDisclaimer={this.props.hasSeenBidDisclaimer}
              setHasSeenBidDisclaimer={this.props.setHasSeenBidDisclaimer}
              domain={this.state.domain}
              handleSubmit={(navigate, val) => this.handleAddBid(navigate, val)}
            />
          ) : (
            <components.ConnectWallet />
          )}
        </components.Modal>
        <div className="mt-4 mb-4 text-lg text-center font-bold">
          {this.state.domain}
        </div>
        {this.renderBody()}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isLoading: selectors.isLoading(state),
  domain: selectors.domain(state),
  bids: services.sunrise.selectors.bids(state),
  isSettingRecord: selectors.isSettingRecord(state),
  isLoadingRecords: selectors.isLoadingRecords(state),
  records: selectors.records(state),
  setRecordComplete: selectors.setRecordComplete(state),
  avatarRecord: selectors.avatarRecord(state),

  isLoadingReverseRecords: selectors.isLoadingReverseRecords(state),
  reverseRecords: selectors.reverseRecords(state),

  resolver: selectors.resolver(state),
  hasSeenBidDisclaimer: services.sunrise.selectors.hasSeenBidDisclaimer(state),
  registrationPremium: selectors.registrationPremium(state),
  isRevealed: services.names.selectors.isRevealed(state),
  isRevealingDomain: selectors.isRevealingDomain(state),
  isRevealComplete: selectors.isRevealComplete(state),
})

const mapDispatchToProps = (dispatch) => ({
  loadRegistrationPremium: () => dispatch(actions.loadRegistrationPremium()),
  loadDomain: (domain) => dispatch(actions.loadDomain(domain)),
  addToCart: (domain) => dispatch(services.cart.actions.addToCart(domain)),
  addBid: (domain, amount) =>
    dispatch(services.sunrise.actions.addBid(domain, amount)),
  setStandardRecord: (domain, type, value) =>
    dispatch(actions.setStandardRecord(domain, type, value)),
  resetSetRecord: () => dispatch(actions.setRecordComplete(false)),
  renewDomain: (domain) => dispatch(services.cart.actions.addToCart(domain)),
  resetSetResolver: () => dispatch(actions.setResolverComplete(false)),
  setHasSeenBidDisclaimer: (value) =>
    dispatch(services.sunrise.actions.setHasSeenBidDisclaimer(value)),
  revealDomain: (domain) => dispatch(actions.revealDomain(domain)),
  resetRevealDomain: () => dispatch(actions.resetRevealDomain()),
  resetTransferDomain: () => dispatch(actions.resetTransferDomain()),
})

const component = connect(mapStateToProps, mapDispatchToProps)(Domain)

component.redux = {
  actions,
  constants,
  reducer,
  selectors,
}

export default component
