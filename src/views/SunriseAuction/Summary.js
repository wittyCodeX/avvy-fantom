import React from 'react'
import { connect } from 'react-redux'
import { ethers } from 'ethers'

import components from 'components'
import services from 'services'

import actions from './actions'
import selectors from './selectors'

class _WftmSummary extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      connected: services.provider.isConnected(),
      success: false, // goes true if they have sufficient wftm
    }
  }

  onConnect() {
    if (this.connect) this.connect.hide()
    this.props.checkAvailableWFTM()
    setTimeout(() => {
      this.setState({
        connected: services.provider.isConnected(),
      })
    }, 1)
  }

  componentDidMount() {
    if (this.state.connected) {
      this.props.checkAvailableWFTM()
    }
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

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.approvedWftm &&
      this.props.availableWftm &&
      this.props.bidTotal
    ) {
      const approved = ethers.BigNumber.from(this.props.approvedWftm)
      const available = ethers.BigNumber.from(this.props.availableWftm)
      const bidTotal = ethers.BigNumber.from(this.props.bidTotal)

      if (
        approved.gte(bidTotal) &&
        available.gte(bidTotal) &&
        !this.state.success
      ) {
        this.setState({
          success: true,
        })
        if (this.props.onSuccess) this.props.onSuccess()
      }
    }
  }

  renderAvailableWftm() {
    if (
      !this.props.approvedWftm ||
      !this.props.availableWftm ||
      !this.props.bidTotal
    )
      return null
    const approved = ethers.BigNumber.from(this.props.approvedWftm)
    const available = ethers.BigNumber.from(this.props.availableWftm)
    const bidTotal = ethers.BigNumber.from(this.props.bidTotal)
    const required = bidTotal.sub(available)
    if (available.lt(bidTotal) || approved.lt(bidTotal)) {
      return (
        <>
          {available.lt(bidTotal) ? (
            <div className="mt-4">
              <components.labels.Error
                text={`You do not have enough WFTM to cover all of your bids. You need to acquire a total of ${services.money.renderWFTM(
                  bidTotal.toString(),
                )}.`}
              />
              <div className="mt-4">
                <components.buttons.Button
                  loading={this.props.gettingWftm}
                  text={`Swap ${services.money.renderFTM(required)} for WFTM`}
                  onClick={() => this.props.getWFTM(required)}
                />
              </div>
            </div>
          ) : null}
          {approved.lt(bidTotal) ? (
            <div className="mt-4">
              <components.labels.Error
                text={'You have not approved enough WFTM to cover your bids'}
              />
              <div className="mt-4">
                <components.buttons.Button
                  text={'Approve WFTM'}
                  onClick={() => this.props.approveWftm(bidTotal.toString())}
                  loading={this.props.isApprovingWftm}
                />
              </div>
            </div>
          ) : null}
        </>
      )
    }
    return (
      <div className="mt-4">
        <components.labels.Success
          text={'You have approved enough WFTM to cover your bids'}
        />
      </div>
    )
  }

  render() {
    if (this.state.connected) return this.renderAvailableWftm()
    return (
      <div className="mt-4">
        <components.Modal
          ref={(ref) => (this.connect = ref)}
          title="Connect your wallet"
        >
          <components.ConnectWallet />
        </components.Modal>
        <components.labels.Information
          text={
            this.props.notConnectedLabel ||
            'Connect your wallet to see whether your bids are covered'
          }
        />
        <div className="mt-4">
          <components.buttons.Button
            text={'Connect your wallet'}
            onClick={() => this.connect.toggle()}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  availableWftm: selectors.availableWftm(state),
  approvedWftm: selectors.approvedWftm(state),
  isApprovingWftm: selectors.isApprovingWftm(state),
  gettingWftm: selectors.gettingWFTM(state),
})

const mapDispatchToProps = (dispatch) => ({
  checkAvailableWFTM: () => dispatch(actions.checkAvailableWFTM()),
  approveWftm: (total) => dispatch(actions.approveWftm(total)),
  getWFTM: (amount) => dispatch(actions.getWFTM(amount)),
})

const WftmSummary = connect(mapStateToProps, mapDispatchToProps)(_WftmSummary)

class FullSummary extends React.PureComponent {
  render() {
    const bidTotal = this.props.bidTotal // this is the amount they will pay for claiming
    const fullBidTotal = this.props.fullBidTotal // this is the total of all their bids
    const registrationTotal = this.props.registrationTotal

    return (
      <>
        <div className="m-auto max-w-xs">
          <div className="border-b border-gray-400 pb-4 mb-4">
            <div className="text-lg text-center font-bold">{'Summary'}</div>
            <div className="text-md text-center text-gray-500">
              {this.props.subtitle || '(Totals if all auctions are won)'}
            </div>
          </div>
          <div className="flex justify-between">
            <div className="font-bold mr-2">{'Auction Bids'}</div>
            <div className="">{services.money.renderWFTM(bidTotal)}</div>
          </div>
          {this.props.costToClaim ? (
            <div className="flex justify-between">
              <div className="font-bold mr-2">{'Cost to Claim All'}</div>
              <div className="">
                {services.money.renderWFTM(this.props.costToClaim)}
              </div>
            </div>
          ) : null}
          <div className="flex justify-between">
            <div className="font-bold mr-2">{'Registration Fees'}</div>
            <div className="">
              {services.money.renderUSD(registrationTotal)} /year
            </div>
          </div>
          {!this.props.showAvailable ? null : (
            <WftmSummary
              notConnectedLabel={this.props.notConnectedLabel}
              bidTotal={fullBidTotal}
            />
          )}
        </div>
      </>
    )
  }
}

const exports = {
  WftmSummary,
  FullSummary,
}

export default exports
