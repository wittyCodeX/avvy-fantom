import React from 'react'
import { connect } from 'react-redux'

import components from 'components'
import services from 'services'

import actions from './actions'
import selectors from './selectors'

class RegistrationFlow extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      connected: services.provider.isConnected(),
      needsProofs: true,
      hasProofs: false,
      hasPrivacy: true,
    }
  }

  reset() {
    this.setState({
      needProofs: true,
      hasProofs: false,
      hasPrivacy: true,
    })
  }

  generateProofs() {
    this.setState(
      {
        needsProofs: false,
      },
      () => {
        this.props.generateProofs(this.props.names)
      },
    )
  }

  finalizeTransaction() {
    this.props.finalizeTransaction()
  }

  onConnect() {
    setTimeout(() => {
      this.setState({
        connected: services.provider.isConnected(),
        needsProofs: true,
      })
    }, 1)
  }

  componentDidMount() {
    services.provider.addEventListener(
      services.provider.EVENTS.CONNECTED,
      this.onConnect.bind(this),
    )
  }

  componentWillUnmount() {
    services.provider.addEventListener(
      services.provider.EVENTS.CONNECTED,
      this.onConnect.bind(this),
    )
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.names.length !== prevProps.names.length) {
      this.setState({
        needsProofs: true,
      })
    }
  }

  renderConnect() {
    return (
      <>
        <div className="font-bold border-b border-gray-400 pb-4 mb-4">
          {'Connect Fantom Opera supported wallet'}
        </div>
        <components.ConnectWallet />
      </>
    )
  }

  renderProofs() {
    return (
      <>
        <div className="font-bold border-b border-gray-400 pb-4 mb-4">
          {'Generate Proofs'}
        </div>
        <components.labels.Information
          text={
            'Please do not refresh or exit the page until generating proofs. Generating zero-knowledge proofs might cause your browser to slow down or even freeze temporarily.'
          }
        />
        {this.state.needsProofs ? (
          <div className="mt-8 max-w-sm m-auto">
            <components.buttons.Button
              text={'Generate proofs'}
              onClick={this.generateProofs.bind(this)}
            />
          </div>
        ) : (
          <>
            <div className="my-8 py-4 rounded">
              <div className="mb-4 text-center text-gray-400 flex items-center justify-center">
                {this.props.progress.message}
              </div>
              <div className="max-w-sm m-auto">
                <components.ProgressBar
                  progress={this.props.progress.percent}
                />
              </div>
            </div>
            <div className="mt-4 max-w-sm m-auto">
              <components.buttons.Button
                text={'Continue'}
                onClick={() => this.setState({ hasProofs: true })}
                disabled={this.props.progress.percent < 100}
              />
            </div>
          </>
        )}
      </>
    )
  }

  renderPrivacy() {
    return (
      <>
        <div className="">
          <div className="font-bold border-b border-gray-400 pb-4 mb-4">
            {'Domain Privacy'}
          </div>
          <components.DomainPrivacy
            error={false}
            onCheck={(isEnhancedPrivacy) =>
              this.props.enableEnhancedPrivacy(isEnhancedPrivacy)
            }
            isEnhancedPrivacy={this.props.enhancedPrivacy}
          />
        </div>
        <div className="mt-4 m-auto max-w-sm">
          <components.buttons.Button
            text={'Continue'}
            onClick={() => this.setState({ hasPrivacy: true })}
          />
        </div>
      </>
    )
  }

  renderFinalize() {
    const names = this.props.names
    const nameData = this.props.nameData
    const quantities = this.props.quantities
    const total = names.reduce(
      (sum, curr) => {
        if (
          nameData[curr].status !==
            nameData[curr].constants.DOMAIN_STATUSES.AVAILABLE &&
          nameData[curr].status !==
            nameData[curr].constants.DOMAIN_STATUSES.REGISTERED_SELF
        ) {
          unavailable.push(curr)
          return sum
        }
        if (
          nameData[curr].status ===
          nameData[curr].constants.DOMAIN_STATUSES.REGISTERED_SELF
        ) {
          hasRenewal = true
        }
        const namePrice = nameData[curr].priceUSDCents
        const namePriceFtm = nameData[curr].priceFTMEstimate
        if (!namePrice || !namePriceFtm)
          return {
            usd: '0',
            ftm: '0',
          }
        const quantity = quantities[curr]
        const registrationPrice = services.money.mul(namePrice, quantity)
        const registrationPriceFtm = services.money.add(
          services.money.mul(namePriceFtm, quantity),
          this.props.registrationPremium,
        )
        return {
          usd: services.money.add(sum.usd, registrationPrice),
          ftm: services.money.add(sum.ftm, registrationPriceFtm),
        }
      },
      { usd: '0', ftm: '0' },
    )
    console.log(total)
    const inBatches = names.length > services.environment.MAX_REGISTRATION_NAMES
    return (
      <>
        <div className="font-bold border-b border-gray-400 pb-4 mb-4">
          {'Complete Registration'}
        </div>

        <div className="m-auto mb-8 max-w-xs">
          <div className="border-b border-gray-400 pb-4 mb-4">
            <div className="text-lg text-center font-bold">
              {'Purchase Summary'}
            </div>
          </div>
          <div className="flex justify-between">
            <div className="font-bold">{'Domain Name'}</div>
            <div className="">{names[0]}</div>
          </div>
          <div className="flex justify-between">
            <div className="font-bold">{'Registration Fees'}</div>
            <div className="">{services.money.renderUSD(total.usd)}</div>
          </div>
          <div className="flex justify-between">
            <div className="font-bold">{'Total (FTM)'}</div>
            <div className="">{services.money.renderFTM(total.ftm)}</div>
          </div>
        </div>
        <div className="mt-8 max-w-sm m-auto">
          <div className="mt-4">
            <components.buttons.Button
              text={
                inBatches
                  ? `Register next ${services.environment.MAX_REGISTRATION_NAMES} names`
                  : 'Finalize registration'
              }
              onClick={this.finalizeTransaction.bind(this)}
              loading={this.props.isFinalizing}
            />
          </div>
        </div>
      </>
    )
  }

  renderComplete() {
    const remaining = this.props.names.length
    return (
      <>
        <div className="font-bold border-b border-gray-400 pb-4 mb-4">
          {'Registration Complete'}
        </div>
        {remaining > 0 ? (
          <>
            <components.labels.Success
              text={`You have successfully registered ${services.environment.MAX_REGISTRATION_NAMES} names`}
            />
            <div className="mt-8 max-w-sm m-auto">
              <div className="mt-4 text-center w-full font-bold">
                {'You have '}
                {remaining} {remaining === 1 ? 'name' : 'names'}
                {' left to register'}
              </div>
              <div className="mt-4">
                <components.buttons.Button
                  text={'Register next batch of names'}
                  onClick={() => this.props.nextBatch()}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <components.labels.Success
              text={'Your registration was successful.'}
            />
            <div className="mt-8 max-w-sm m-auto">
              <div className="mt-4">
                <components.buttons.Button
                  text={'View my domains'}
                  onClick={(navigate) =>
                    services.linking.navigate(navigate, 'MyDomains')
                  }
                />
              </div>
            </div>
          </>
        )}
      </>
    )
  }

  renderHasError() {
    return (
      <>
        <div className="font-bold border-b border-gray-400 pb-4 mb-4">
          {'Error'}
        </div>
        <components.labels.Error
          text={
            "We've encountered an error with your registration. Please reload the page and try again."
          }
        />
        <div className="mt-8 max-w-sm m-auto">
          <components.buttons.Button
            text={'Reload page'}
            onClick={() => window.location.reload()}
          />
        </div>
      </>
    )
  }

  render() {
    if (this.props.hasError) return this.renderHasError()
    if (!this.state.connected) return this.renderConnect()
    if (!this.state.hasProofs) return this.renderProofs()
    if (!this.state.hasPrivacy) return this.renderPrivacy()
    if (!this.props.isComplete) return this.renderFinalize()
    return this.renderComplete()
  }
}

const mapStateToProps = (state) => ({
  progress: selectors.progress(state),
  names: services.cart.selectors.names(state),
  quantities: services.cart.selectors.quantities(state),
  pricingProofs: services.proofs.selectors.pricingProofs(state),
  constraintsProofs: services.proofs.selectors.constraintsProofs(state),
  hasCommit: selectors.hasCommit(state),
  hasError: selectors.hasError(state),
  isComplete: selectors.isComplete(state),
  isCommitting: selectors.isCommitting(state),
  isFinalizing: selectors.isFinalizing(state),
  enhancedPrivacy: selectors.enhancedPrivacy(state),
})

const mapDispatchToProps = (dispatch) => ({
  generateProofs: (names) => dispatch(actions.generateProofs(names)),
  finalizeTransaction: () => dispatch(actions.finalize()),
  enableEnhancedPrivacy: (value) =>
    dispatch(actions.enableEnhancedPrivacy(value)),
  nextBatch: () => dispatch(actions.reset()),
})

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationFlow)
