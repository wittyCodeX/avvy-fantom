import React from 'react'
import { connect } from 'react-redux'

import components from 'components'

import actions from './actions'
import selectors from './selectors'


class VerifyWallet extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { 
    }
  }

  componentDidMount() {
  }

  render() {
    return (
      <>
        <div className='max-w-md m-auto'>
          <div className='my-8'>
            <components.labels.Information text={'Verify your wallet to continue with your registration.'} />
          </div>
          <div className='mb-4'>
            <components.buttons.Button text={'Sign Challenge'} disabled={this.props.signChallengeComplete} onClick={() => this.props.signChallenge()} loading={this.props.signChallengeLoading} />
          </div>
          <div className='mb-4'>
            <components.buttons.Button disabled={!this.props.signChallengeComplete} text={'Submit Verification'} onClick={() => this.props.submitVerification()} loading={this.props.submitVerificationLoading} />
          </div>
          {this.props.error ? (
            <div className='my-8 mb-4'>
              <components.labels.Error text={this.props.error} />
            </div>
          ) : null}
        </div>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  signChallengeLoading: selectors.signChallengeLoading(state),
  signChallengeComplete: selectors.signChallengeComplete(state),
  error: selectors.verifyWalletError(state),
  submitVerificationLoading: selectors.submitWalletVerificationLoading(state),
  submitVerificationComplete: selectors.submitWalletVerificationComplete(state),
})

const mapDispatchToProps = (dispatch) => ({
  signChallenge: () => dispatch(actions.signChallenge()),
  submitVerification: () => dispatch(actions.submitWalletVerification()),
  reset: () => null,
})

export default connect(mapStateToProps, mapDispatchToProps)(VerifyWallet)
