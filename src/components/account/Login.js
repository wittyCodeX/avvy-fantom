import React from 'react'
import { connect } from 'react-redux'

import components from 'components'

import actions from './actions'
import selectors from './selectors'

function LoginForm(props) {
  let email = React.createRef()
  let password = React.createRef()
  
  const handleSubmit = (e) => {
    props.onSubmit(email.current.value, password.current.value)
  }
  
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className='pb-2 pl-2 text-gray-700 text-sm uppercase font-bold'>Email Address</div>
        <div className='bg-gray-100 rounded-xl w-full text-center relative'>
          <input autoComplete="off" ref={email} autoCapitalize="off" className='bg-transparent w-full placeholder:text-gray-400 text-black text-center p-4' />
        </div>
        <div className='pb-2 pl-2 center text-gray-700 text-sm uppercase mt-4 font-bold'>Password</div>
        <div className='bg-gray-100 rounded-xl w-full text-center relative'>
          <input type="password" autoComplete="off" ref={password} autoCapitalize="off" className='bg-transparent w-full placeholder:text-gray-400 text-black text-center p-4' />
        </div>
        {props.error ? (
          <div className='my-4'>
            <components.labels.Error text={props.error} />
          </div>
        ) : null}
        <div className='mt-4'>
          <components.buttons.Button text='Login' onClick={() => handleSubmit()} loading={props.loading} />
        </div>
      </form>
    </>
  )
}

class Login extends React.PureComponent {
  componentDidMount() {
    this.props.reset()
  }
  
  handleLogin =  (email, password) => {
    this.props.login(email, password)
  }

  render() {
    return (
      <>
        <div className='relative max-w-sm m-auto mt-8'>
          <div className='text-center pb-4 font-bold text-xl'>Login</div>
          <LoginForm onSubmit={this.handleLogin} loading={this.props.isLoggingIn} error={this.props.loginError} />
        </div>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  loginError: selectors.loginError(state),
  isLoggingIn: selectors.isLoggingIn(state),
})

const mapDispatchToProps = (dispatch) => ({
  reset: () => dispatch(actions.resetLogin()),
  login: (email, password) => dispatch(actions.login(email, password)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
