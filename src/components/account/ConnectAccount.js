import React from 'react'
import { connect } from 'react-redux'

import services from 'services'

import actions from './actions'
import selectors from './selectors'
import CreateAccount from './CreateAccount'
import Login from './Login'
import ResetPassword from './ResetPassword'
import VerifyWallet from './VerifyWallet'


const LOGIN_STATES = {
  LOGIN: 0,
  RESET_PASSWORD: 1,
  CREATE_ACCOUNT: 2,
}

class ConnectAccount extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { 
      loginState: LOGIN_STATES.LOGIN,
    }
  }

  componentDidMount() {
    this.props.checkHasAccount()
    this.props.reset()
  }

  setResetPassword = () => {
    this.props.reset()
    this.setState({ loginState: LOGIN_STATES.RESET_PASSWORD })
  }

  setCreateAccount = () => {
    this.props.reset()
    this.setState({ loginState: LOGIN_STATES.CREATE_ACCOUNT })
  }

  setLogin = () => {
    this.props.reset()
    this.setState({ loginState: LOGIN_STATES.LOGIN })
  }

  renderAccountSignature() {
    return <VerifyWallet />
  }

  renderNeedToken() {
    let Component = {
      [LOGIN_STATES.LOGIN]: Login,
      [LOGIN_STATES.RESET_PASSWORD]: ResetPassword,
      [LOGIN_STATES.CREATE_ACCOUNT]: CreateAccount,
    }[this.state.loginState]

    return (
      <>
        <Component />
        <div className='my-4 flex text-sm justify-center'>
          {this.state.loginState === LOGIN_STATES.LOGIN ? (
            <>
              <div className='cursor-pointer px-2 text-gray-500' onClick={this.setCreateAccount}>Create an account</div>
              <div className='cursor-pointer px-2 text-gray-500' onClick={this.setResetPassword}>Reset your password</div>
            </>
          ) : null}
          {this.state.loginState === LOGIN_STATES.RESET_PASSWORD ? (
            <>
              <div className='cursor-pointer px-2 text-gray-500' onClick={this.setLogin}>Login</div>
              <div className='cursor-pointer px-2 text-gray-500' onClick={this.setCreateAccount}>Create an account</div>
            </>
          ) : null}
          {this.state.loginState === LOGIN_STATES.CREATE_ACCOUNT ? (
            <>
              <div className='cursor-pointer px-2 text-gray-500' onClick={this.setLogin}>Login</div>
              <div className='cursor-pointer px-2 text-gray-500' onClick={this.setResetPassword}>Reset your password</div>
            </>
          ) : null}
        </div>
      </>
    )
  }

  render() {
    // (login token)
    if (!this.props.token) return this.renderNeedToken()
    if (!this.props.accountSignature) return this.renderAccountSignature()
    return null
  }
}

const mapStateToProps = (state) => ({
  hasAccount: selectors.hasAccount(state),
  accountSignature: selectors.accountSignature(state),
  token: services.user.selectors.token(state),
})

const mapDispatchToProps = (dispatch) => ({
  checkHasAccount: () => dispatch(actions.checkHasAccount()),
  reset: () => null,
})

export default connect(mapStateToProps, mapDispatchToProps)(ConnectAccount)
