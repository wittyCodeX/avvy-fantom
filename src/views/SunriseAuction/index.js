import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { ArrowRightIcon, ExternalLinkIcon } from '@heroicons/react/solid'

import services from 'services'
import actions from './actions'
import constants from './constants'
import reducer from './reducer'
import selectors from './selectors'

import AuctionPhase from './AuctionPhase'
import MyBids from './MyBids'

import components from 'components'

class SunriseAuction extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isConnected: services.provider.isConnected(),
      importingBids: false,
    }
  }

  onConnect() {
    setTimeout(() => {
      this.setState({
        isConnected: services.provider.isConnected(),
      })
    }, 1)
  }

  componentDidMount() {
    this.props.loadAuctionPhases()
    services.provider.addEventListener(
      services.provider.EVENTS.CONNECTED,
      this.onConnect.bind(this),
    )
  }

  componentWillUnmount() {
    services.provider.removeEventListener(
      services.provider.EVENTS.CONNECTED,
      this.onConnect.bind(this),
    )
  }

  renderAuctionPhases() {
    const bidPlacementStartsAt = this.props.auctionPhases[0] * 1000
    const bidRevealStartsAt = this.props.auctionPhases[1] * 1000
    const claimStartsAt = this.props.auctionPhases[2] * 1000
    const claimEndsAt = this.props.auctionPhases[3] * 1000
    const end = new Date((claimEndsAt + 60 * 60 * 24 * 365 * 100) * 1000)
    return (
      <div className="mt-4 bg-gray-100 rounded-lg p-4 dark:bg-gray-800">
        <div className="font-bold mb-4">{'Auction Phases'}</div>
        <div className="mt-2">
          <AuctionPhase
            name="Bid placement"
            startsAt={bidPlacementStartsAt}
            endsAt={bidRevealStartsAt}
          />
        </div>
        <div className="mt-2">
          <AuctionPhase
            name="Bid reveal"
            startsAt={bidRevealStartsAt}
            endsAt={claimStartsAt}
          />
        </div>
        <div className="mt-2">
          <AuctionPhase
            name="Domain claiming"
            startsAt={claimStartsAt}
            endsAt={claimEndsAt}
          />
        </div>
        <div className="mt-2">
          <AuctionPhase
            name="Auction over"
            startsAt={claimEndsAt}
            endsAt={end}
          />
        </div>
      </div>
    )
  }

  downloadBulkBidTemplate() {
    services.files.download(
      'Domain Name,Bid Amount (wei)\nfnsdomains.ftm,1000000000000000000',
      'text/csv',
      'fns-bid-template.csv',
    )
  }

  async uploadBulkBidTemplate(navigator) {
    const data = await services.files.upload()
    const lines = data.replace('\r\n', '\n').replace('\r', '\n').split('\n')
    const bids = {}
    for (let i = 0; i < lines.length; i += 1) {
      if (i > 0) {
        let split = lines[i].split(',')
        bids[split[0]] = split[1]
      }
    }
    this.props.addBulkBids(bids)
    this.setState({
      importingBids: true,
    })
  }

  renderSections() {
    if (!this.props.auctionPhases)
      return (
        <div className="m-auto text-center">
          <components.Spinner
            color={this.props.isDarkmode ? '#eee' : '#555'}
            size="md"
          />
        </div>
      )
    const bidPlacementStartsAt = this.props.auctionPhases[0] * 1000
    const bidRevealStartsAt = this.props.auctionPhases[1] * 1000
    const claimEndsAt = this.props.auctionPhases[3] * 1000
    const now = parseInt(Date.now())
    return (
      <>
        {now >= bidPlacementStartsAt && now < claimEndsAt ? (
          <div className="mb-4">
            <Link to={services.linking.path('SunriseAuctionMyBids')}>
              <div className="cursor-pointer flex items-center justify-between bg-gray-100 rounded-lg p-4 font-bold dark:bg-gray-800">
                <div>{'My Bids'}</div>
                <ArrowRightIcon className="h-6" />
              </div>
            </Link>
          </div>
        ) : null}
        <div>
          <a href="https://fns.domains/docs/" target="_blank">
            <div className="cursor-pointer flex items-center justify-between bg-gray-100 rounded-lg p-4 font-bold dark:bg-gray-800">
              <div>{'Auction Documentation'}</div>
              <ExternalLinkIcon className="h-6" />
            </div>
          </a>
        </div>
        {this.renderAuctionPhases()}
        {now < bidRevealStartsAt && now >= bidPlacementStartsAt ? (
          <div className="mt-4 text-center text-gray-500 text-sm">
            <div
              className="underline cursor-pointer"
              onClick={() => this.bulkBidModal.toggle()}
            >
              {'Want to place bids in bulk?'}
            </div>
          </div>
        ) : null}
      </>
    )
  }

  render() {
    return (
      <div className="max-w-screen-md m-auto">
        <components.Modal
          ref={(ref) => (this.bulkBidModal = ref)}
          title={
            this.state.isConnected
              ? 'Bulk bid'
              : 'Connect Fantom Opera supported wallet'
          }
        >
          {this.state.importingBids ? (
            <div className="max-w-sm m-auto">
              <div className="mb-4 font-bold text-center ">Importing Bids</div>
              <div className="mb-4">
                <components.ProgressBar
                  progress={this.props.nameDataProgress}
                />
              </div>
              <components.buttons.Button
                text={'View My Bids'}
                disabled={this.props.nameDataProgress < 100}
                onClick={(navigator) => {
                  services.linking.navigate(navigator, 'SunriseAuctionMyBids')
                }}
              />
            </div>
          ) : this.state.isConnected ? (
            <>
              <div className="mb-4">
                {'To place bids in bulk, follow the steps below.'}
              </div>
              <ol className="list-decimal pl-4">
                <li>
                  <span
                    className="underline cursor-pointer"
                    onClick={this.downloadBulkBidTemplate.bind(this)}
                  >
                    {'Download our bulk-bid template'}
                  </span>
                  {' and edit it as described in the following steps.'}
                </li>
                <li>
                  {'In the '}
                  <span className="font-bold">{'Domain Name'}</span>
                  {
                    ' column, enter the name you wish to register. You must include the .ftm extension. Any names that are not of the format '
                  }
                  <span className="font-bold">{'nametoregister.ftm'}</span>
                  {' will be disregarded.'}
                </li>
                <li>
                  {'In the '}
                  <span className="font-bold">Bid Amount</span>
                  {
                    ' column, include the value of your bid in wei. For example, 1 FTM can be represented as 1000000000000000000.'
                  }
                </li>
                <li>{'Upload the edited template.'}</li>
              </ol>
              <div className="mt-8 max-w-sm m-auto">
                <components.buttons.Button
                  text="Upload template"
                  onClick={(navigator) => this.uploadBulkBidTemplate(navigator)}
                />
              </div>
            </>
          ) : (
            <components.ConnectWallet />
          )}
        </components.Modal>
        <div className="font-bold text-center mt-4 text-lg">
          {'Sunrise Auction'}
        </div>
        <div className="max-w-sm m-auto mt-4 mb-8">
          {
            'Welcome to the sunrise auction. During the auction, you may select & bid on the domains you wish to acquire.'
          }
        </div>
        {this.renderSections()}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auctionPhases: selectors.auctionPhases(state),
  isDarkmode: services.darkmode.selectors.isDarkmode(state),
  nameDataProgress: services.sunrise.selectors.nameDataProgress(state),
})

const mapDispatchToProps = (dispatch) => ({
  loadAuctionPhases: () => dispatch(actions.loadAuctionPhases()),
  addBulkBids: (bids) => dispatch(actions.addBulkBids(bids)),
})

const component = connect(mapStateToProps, mapDispatchToProps)(SunriseAuction)

component.redux = {
  actions,
  constants,
  reducer,
  selectors,
}

component.MyBids = MyBids

export default component
