import React from 'react'
import { connect } from 'react-redux'

import components from 'components'
import services from 'services'

import actions from './actions'
import selectors from './selectors'


class BidFlow extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      connected: services.provider.isConnected(),
      needsProofs: true,
      hasProofs: false,
      revealBidsConfirm: false,
      dataBackupConfirm: false,
      hasBackedUp: false,
    }
  }

  checkRevealBidsConfirm = () => {
    this.setState((currState) => {
      return {
        revealBidsConfirm: !currState.revealBidsConfirm
      }
    })
  }

  checkDataBackupConfirm = () => {
    this.setState((currState) => {
      return {
        dataBackupConfirm: !currState.dataBackupConfirm
      }
    })
  }

  generateProofs() {
    this.setState({
      needsProofs: false
    }, () => {
      this.props.generateProofs()
    })
  }

  submitBid() {
    this.props.submitBid()
  }

  backupData = async () => {
    await services.data.backup()
    this.setState({
      hasBackedUp: true
    })
  }

  onConnect() {
    setTimeout(() => {
      this.setState({
        connected: services.provider.isConnected(),
        needsProofs: true
      })
    }, 1)
  }

  componentDidMount() {
    services.provider.addEventListener(services.provider.EVENTS.CONNECTED, this.onConnect.bind(this))
  }

  componentWillUnmount() {
    services.provider.removeEventListener(services.provider.EVENTS.CONNECTED, this.onConnect.bind(this))
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.names.length !== prevProps.names.length) {
      this.setState({
        needsProofs: true
      })
    }
  }

  renderConnect() {
    return (
      <>
        <div className='font-bold border-b border-gray-400 pb-4 mb-4'>{'Connect Wallet'}</div>
        <components.ConnectWallet />
      </>
    )
  }

  renderProofs() {
    if (services.provider.providerType() === services.provider.PROVIDER_TYPES.METAMASK && services.device.isMobile() && !this.state.ignoreMobileWarning) {
      return (
        <>
          <div className='font-bold border-b border-gray-400 pb-4 mb-4'>{'Generate Proofs'}</div>
          <div className='m-auto mt-4'>
            <components.labels.Error text={'Metamask Mobile Browser will likely fail to generate proofs for registration. To participate in the auction with Metamask Mobile, use the website on a computer and use WalletConnect to connect to Metamask Mobile.'} />
          </div>
          <div className='max-w-sm m-auto mt-4'>
            <components.checkbox.Checkbox text={'I understand it might not work. I will continue & try regardless.'} onCheck={() => this.setState({ understandMobileWarning: true })} checked={this.state.understandMobileWarning} />
          </div>
          <div className='mt-4 max-w-sm m-auto'>
            <components.buttons.Button text={'Continue'} onClick={() => this.setState({ ignoreMobileWarning: true })} disabled={!this.state.understandMobileWarning} />
          </div>
        </>
      )
    }
    return (
      <>
        <div className='font-bold border-b border-gray-400 pb-4 mb-4'>{'Generate Proofs'}</div>
        <components.labels.Information text={"Generating zero-knowledge proofs might cause your browser to slow down or even freeze temporarily. Just sit tight, we'll let you know when it's done. Please do not refresh or exit the page."} />
        {this.state.needsProofs ? (
          <div className='mt-8 max-w-sm m-auto'>
            <components.buttons.Button text={'Generate proofs'} onClick={this.generateProofs.bind(this)} />
          </div>
        ) : (
          <>
            <div className='my-8 py-4 rounded'>
              <div className='mb-4 text-center text-gray-400 flex items-center justify-center'>
                {this.props.progress.message}
              </div>
              <div className='max-w-sm m-auto'>
                <components.ProgressBar progress={this.props.progress.percent} />
              </div>
            </div>
            <div className='mt-4 max-w-sm m-auto'>
              <components.buttons.Button text={'Continue'} onClick={() => this.setState({ hasProofs: true })} disabled={this.props.progress.percent < 100} />
            </div>
          </>
        )}
      </>
    )
  }

  renderFinalize() {
    return (
      <>
        <div className='font-bold border-b border-gray-400 pb-4 mb-4'>{'Place Bids'}</div>
        <components.labels.Information text={"In this step we submit your bids to the blockchain. You MUST return to reveal your bids & to claim any won auctions; otherwise your bids will be disqualified."} />
        <div className='mt-8 max-w-sm m-auto'>
          <div className='mb-4'>
              <components.checkbox.Checkbox onCheck={this.checkRevealBidsConfirm} checked={this.state.revealBidsConfirm} text={'I understand that I must return to reveal my bids during the Bid Reveal phase or my bids will be disqualified.'} />
          </div>
          <div className='mb-4'>
            <components.checkbox.Checkbox onCheck={this.checkDataBackupConfirm} checked={this.state.dataBackupConfirm} text={'I understand that my bid details are stored in my web browser and if that data is lost, I will not be able to reveal my bids.'} />
          </div>
          <div className='mt-4'>
            <components.buttons.Button disabled={!this.state.dataBackupConfirm || !this.state.revealBidsConfirm} text={'Submit bid'} onClick={this.submitBid.bind(this)} loading={this.props.isBidding && !this.props.isComplete} />
          </div>
        </div>
      </>
    )
  }

  renderComplete() {
    return (
      <>
        <div className='font-bold border-b border-gray-400 pb-4 mb-4'>{'Bid submission complete'}</div>
        <components.labels.Success text={"Your sealed bids were successfully submitted. DO NOT forget that there are more steps to complete. Failure to complete additional steps will result in your bids being disqualified."} />
        <div className='mt-8 max-w-sm m-auto'>
          <div className='mt-4'>
            <components.buttons.Button disabled={this.state.hasBackedUp} text={'Backup data'} onClick={this.backupData} />
          </div>
          <div className='mt-4'>
            <components.buttons.Button disabled={!this.state.hasBackedUp} text={'View my bids'} onClick={(navigate) => {
              this.props.onComplete()
              services.linking.navigate(navigate, 'SunriseAuctionMyBids')
            }} />
          </div>
        </div>
      </>
    )
  }

  renderHasError() {
    return (
      <>
        <div className='font-bold border-b border-gray-400 pb-4 mb-4'>{'Error'}</div>
        <components.labels.Error text={"We've encountered an error with your registration. Please reload the page and try again."} />
        <div className='mt-8 max-w-sm m-auto'>
          <components.buttons.Button text={'Reload page'} onClick={() => window.location.reload()} />

        </div>
      </>
    )
  }

  render() {
    if (this.props.hasError) return this.renderHasError()
    if (!this.state.connected) return this.renderConnect()
    if (!this.state.hasProofs) return this.renderProofs()
    if (!this.props.isComplete) return this.renderFinalize()
    return this.renderComplete()
  }
}

const mapStateToProps = (state) => ({
  names: services.sunrise.selectors.names(state),
  bids: services.sunrise.selectors.bids(state),
  progress: selectors.proofProgress(state),
  hasError: selectors.hasBidError(state),
  isBidding: selectors.biddingInProgress(state),
  isComplete: selectors.biddingIsComplete(state),
})

const mapDispatchToProps = (dispatch) => ({
  generateProofs: (names) => dispatch(actions.generateProofs(names)),
  submitBid: () => dispatch(actions.submitBid()),
})


export default connect(mapStateToProps, mapDispatchToProps)(BidFlow)
