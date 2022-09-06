import React from 'react'
import { connect } from 'react-redux'

import services from 'services'
import components from 'components'

class ConnectWallet extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      connecting: false,
      privacy: false,
      terms: false,
    }
  }

  reset() {
    this.setState({
      connecting: false,
    })
  }

  async connectMetamask(providerFunc) {
    const func = async () => {
      this.setState(
        {
          connecting: true,
        },
        async () => {
          try {
            await services.provider.connectMetamask(providerFunc)
          } catch (err) {
            alert('Failed to connect')
            this.setState({
              connecting: false,
            })
          }
        },
      )
    }

    await func()
  }

  async connectCore() {
    this.setState(
      {
        connecting: true,
      },
      async () => {
        try {
          await services.provider.connectCore()
        } catch (err) {
          alert('Failed to connect')
          this.setState({
            connecting: false,
          })
        }
      },
    )
  }

  async walletConnect() {
    this.setState(
      {
        connecting: true,
      },
      async () => {
        try {
          await services.provider.connectWalletConnect()
        } catch (err) {
          if (err === 'WRONG_CHAIN') {
            alert(
              `Wrong EVM chain. Please connect to ${services.environment.DEFAULT_CHAIN_NAME}.`,
            )
          } else {
            alert('Failed to connect')
          }
          this.setState({
            connecting: false,
          })
        }
      },
    )
  }

  toggleDisclaimer(stateKey) {
    this.setState((currState) => {
      return {
        [stateKey]: !currState[stateKey],
      }
    })
  }

  renderDisclaimers() {
    return (
      <>
        <div className="">
          <p>
            By checking the boxes below, you acknowledge that you have read and
            agree to our{' '}
            <a
              className="text-alert-blue"
              href="https://avvy.domains/p/privacy-policy"
              target="_blank"
            >
              Privacy Policy
            </a>{' '}
            and our{' '}
            <a
              className="text-alert-blue"
              href="https://avvy.domains/p/terms-of-service"
              target="_blank"
            >
              Terms of Service
            </a>
            .
          </p>
          <p className="mt-2">
            You also acknowledge that{' '}
            <a
              className="text-alert-blue"
              target="_blank"
              href="https://avvy.domains/blog/name-squatting-dispute-resolution/"
            >
              FTMVY Domains supports name disputes
            </a>
            .
          </p>
        </div>
        <div className="mt-4">
          <components.checkbox.Checkbox
            text={'I have read and agree to the Privacy Policy'}
            singleLine={true}
            checked={this.state.privacy}
            onCheck={() => this.toggleDisclaimer('privacy')}
          />
        </div>
        <div className="mt-2">
          <components.checkbox.Checkbox
            text={'I have read and agree to the Terms of Service'}
            singleLine={true}
            checked={this.state.terms}
            onCheck={() => this.toggleDisclaimer('terms')}
          />
        </div>
        <div className="mt-2">
          <components.checkbox.Checkbox
            text={'I understand that FTMVY supports name disputes'}
            singleLine={true}
            checked={this.state.disputes}
            onCheck={() => this.toggleDisclaimer('disputes')}
          />
        </div>
        <div className="mt-4 max-w-sm m-auto">
          <components.buttons.Button
            disabled={
              !this.state.terms || !this.state.privacy || !this.state.disputes
            }
            text={'Continue'}
            onClick={() => this.props.acceptDisclaimers()}
          />
        </div>
      </>
    )
  }

  renderStaticImage(path, alt) {
    const src = services.linking.static(path)
    return <img src={src} alt={alt} className="w-full" />
  }

  render() {
    const wallets = [
      {
        name: 'Core',
        logo: (
          <svg
            height="100%"
            viewBox="0 0 589 574"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M184.366 495C126.798 495 72.7599 482.71 26 461.179L216.242 287.505C189.966 265.944 173.2 233.212 173.2 196.566C173.2 159.252 190.582 125.998 217.687 104.462V79.0034H289.943C290.21 79.0017 290.477 79.0017 290.745 79.0017C320.129 79.0017 346.994 89.7847 367.602 107.612C388.209 89.7864 415.073 79.0034 444.457 79.0034H444.631L444.636 79L444.64 79.0034H517.515V104.464C544.621 126.002 562 159.255 562 196.569C562 243.492 534.516 283.995 494.77 302.851C480.56 344.813 453.83 382.555 418.054 413.255V467.509H328.122C284.853 485.101 236.03 495 184.366 495ZM290.744 287.003C312.141 287.003 331.803 279.57 347.288 267.144L367.419 312.481L387.646 266.929C403.171 279.484 422.935 287.003 444.455 287.003C494.393 287.003 534.873 246.516 534.873 196.569C534.873 146.623 494.393 106.135 444.455 106.135C412.008 106.135 383.552 123.229 367.6 148.907C351.648 123.229 323.192 106.135 290.744 106.135C240.808 106.135 200.326 146.623 200.326 196.569C200.326 246.516 240.808 287.003 290.744 287.003ZM290.744 259.873C325.699 259.873 354.036 231.531 354.036 196.569C354.036 161.606 325.699 133.264 290.744 133.264C255.788 133.264 227.451 161.606 227.451 196.569C227.451 231.531 255.788 259.873 290.744 259.873ZM290.744 232.743C310.719 232.743 326.91 216.548 326.91 196.569C326.91 176.591 310.719 160.394 290.744 160.394C270.769 160.394 254.577 176.591 254.577 196.569C254.577 216.548 270.769 232.743 290.744 232.743ZM507.747 196.569C507.747 231.531 479.411 259.873 444.455 259.873C409.5 259.873 381.161 231.531 381.161 196.569C381.161 161.606 409.5 133.264 444.455 133.264C479.411 133.264 507.747 161.606 507.747 196.569ZM480.622 196.569C480.622 216.548 464.43 232.743 444.455 232.743C424.48 232.743 408.287 216.548 408.287 196.569C408.287 176.591 424.48 160.394 444.455 160.394C464.43 160.394 480.622 176.591 480.622 196.569Z"
              fill={this.props.isDarkmode ? 'white' : 'black'}
            />
          </svg>
        ),
        connect: () => {
          this.connectCore.bind(this)()
        },
        class: 'h-12 w-12',
      },
      {
        name: 'MetaMask',
        logo: this.renderStaticImage('images/vendor/metamask.svg', 'MetaMask'),
        connect: () => {
          this.connectMetamask.bind(this)((provider) => provider.isMetaMask)
        },
        class: 'h-12 w-12',
      },
      {
        name: 'Coinbase Wallet',
        logo: this.renderStaticImage(
          'images/vendor/coinbase.png',
          'Coinbase Wallet',
        ),
        connect: () => {
          this.connectMetamask.bind(this)(
            (provider) => provider.isCoinbaseWallet,
          )
        },
        class: 'h-12 w-12',
      },
      {
        name: 'WalletConnect',
        logo: this.renderStaticImage(
          'images/vendor/walletconnect.svg',
          'WalletConnect',
        ),
        connect: this.walletConnect.bind(this),
        class: 'h-12 w-12',
      },
    ]
    if (!this.props.hasAcceptedDisclaimers) return this.renderDisclaimers()

    return (
      <>
        {this.state.connecting ? (
          <div>
            <div className="my-8">
              <components.labels.Information text={'Connecting to wallet'} />
            </div>
            <div className="max-w-sm m-auto">
              <components.buttons.Button
                type="sm"
                text="Cancel connection"
                onClick={this.reset.bind(this)}
              />
            </div>
          </div>
        ) : (
          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {wallets.map((wal, index) => (
              <div
                key={index}
                onClick={wal.connect}
                className={`cursor-pointer flex flex-col items-center justify-center rounded-xl m-auto bg-gray-100 dark:bg-gray-800 w-full h-32 ${
                  this.state.connecting ? 'blur' : ''
                }`}
              >
                <div
                  className={`${wal.class} flex items-center justify-center`}
                >
                  {wal.logo}
                </div>
                <div className="mt-2">{wal.name}</div>
              </div>
            ))}
          </div>
        )}
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  injectSentry: services.user.selectors.injectSentry(state),
  hasAcceptedDisclaimers: services.user.selectors.hasAcceptedDisclaimers(state),
  isDarkmode: services.darkmode.selectors.isDarkmode(state),
})

const mapDispatchToProps = (dispatch) => ({
  acceptDisclaimers: () => dispatch(services.user.actions.acceptDisclaimers()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ConnectWallet)
