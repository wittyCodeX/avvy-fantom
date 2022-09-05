import React from 'react'
import { connect } from 'react-redux'

import components from 'components'
import services from 'services'

import actions from './actions'
import selectors from './selectors'


function SetPasswordForm(props) {
  let password = React.createRef()
  let passwordConfirm = React.createRef()
  
  const handleSubmit = (e) => {
    props.onSubmit(password.current.value, passwordConfirm.current.value)
  }
  
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className='pb-2 pl-2 text-gray-700 text-sm uppercase font-bold'>Password</div>
        <div className='bg-gray-100 rounded-xl w-full text-center relative'>
          <input type="password" autoComplete="off" ref={password} autoCapitalize="off" className='bg-transparent w-full placeholder:text-gray-400 text-black text-center p-4' />
        </div>
        <div className='pb-2 pl-2 center text-gray-700 text-sm uppercase mt-4 font-bold'>Confirm Password</div>
        <div className='bg-gray-100 rounded-xl w-full text-center relative'>
          <input type="password" autoComplete="off" ref={passwordConfirm} autoCapitalize="off" className='bg-transparent w-full placeholder:text-gray-400 text-black text-center p-4' />
        </div>
        {props.error ? (
          <div className='my-4'>
            <components.labels.Error text={props.error} />
          </div>
        ) : null}
        <div className='mt-4'>
          <components.buttons.Button text='Submit' onClick={() => handleSubmit()} loading={props.loading} />
        </div>
      </form>
    </>
  )
}


class SetPassword extends React.PureComponent {
  constructor(props) {
    super(props)
    const params = services.linking.getParams('SetPassword')
    this.state = {
      token: params.token,
      error: null
    }
  }

  updateParams = () => {
    const params = services.linking.getParams('SetPassword')
    this.setState({
      token: params.token
    })
  }

  componentDidMount() {
    services.linking.addEventListener('SetPassword', this.updateParams)
    this.props.reset()
  }

  componentWillUnmount() {
    services.linking.removeEventListener('SetPassword', this.updateParams)
  }

  setPassword = (password, passwordConfirm) => {
    if (password !== passwordConfirm) this.setState({
      error: 'Passwords do not match'
    }) 
    else {
      this.props.setPassword(this.state.token, password, passwordConfirm)
      this.setState({
        error: null
      })
    }
  }

  render() {
    return ( 
      <div className='max-w-screen-md m-auto'>
        <div className='mt-4 mb-4 text-lg text-center font-bold'>{"Set Password"}</div>
        <div className='max-w-md m-auto'>
          {this.props.result ? (
            <>
              <components.labels.Success text={'Your password has been set. You can now proceed with registering a domain or participating in the auction.'} />
            </>
          ) : (
            <SetPasswordForm onSubmit={this.setPassword} error={this.props.error || this.state.error} loading={this.props.loading} />
          )}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  error: selectors.setPasswordError(state),
  loading: selectors.setPasswordLoading(state),
  result: selectors.setPasswordResult(state),
})

const mapDispatchToProps = (dispatch) => ({
  setPassword: (token, password, passwordConfirm) => dispatch(actions.setPassword(token, password, passwordConfirm)),
  reset: () => dispatch(actions.resetSetPassword()),
})

export default connect(mapStateToProps, mapDispatchToProps)(SetPassword)
