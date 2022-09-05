import React from 'react'
import { connect } from 'react-redux'

import components from 'components'

import actions from './actions'
import selectors from './selectors'


function ResetPasswordForm(props) {
  let email = React.createRef()
  
  const handleSubmit = (e) => {
    props.onSubmit(email.current.value)
  }
  
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className='pb-2 pl-2 text-gray-700 text-sm uppercase font-bold'>Email Address</div>
        <div className='bg-gray-100 rounded-xl w-full text-center relative'>
          <input autoComplete="off" disabled={props.result === true} ref={email} autoCapitalize="off" className='bg-transparent w-full placeholder:text-gray-400 text-black text-center p-4' />
        </div>
        {props.result === true ? (
          <div className='my-4'>
            <components.labels.Success text={'Please check your email for further instructions.'} />
          </div>
        ) : props.result === false ? (
          <div className='my-4'>
            <components.labels.Error text={'Failed to reset password.'} />
          </div>
        ) : null}
        {props.result !== true ? (
          <div className='mt-4'>
            <components.buttons.Button text='Reset Password' onClick={() => handleSubmit()} loading={props.loading} />
          </div>
        ) : (
          <div className='w-full h-1 bg-gray-100 py-2'></div>
        )}
      </form>
    </>
  )
}

class ResetPassword extends React.PureComponent {
  componentDidMount() {
    this.props.reset()
  }

  handleResetPassword = (email) => {
    this.props.resetPassword(email)
  }

  render() {
    return (
      <>
        <div className='relative max-w-sm m-auto mt-8'>
          <div className='text-center pb-4 font-bold text-xl'>Reset Password</div>
          <ResetPasswordForm onSubmit={this.handleResetPassword} loading={this.props.resetPasswordLoading} result={this.props.resetPasswordResult} />
        </div>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  resetPasswordResult: selectors.resetPasswordResult(state),
  resetPasswordLoading: selectors.resetPasswordLoading(state),
})

const mapDispatchToProps = (dispatch) => ({
  reset: () => dispatch(actions.resetResetPassword()),
  resetPassword: (email) => dispatch(actions.resetPassword(email)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword)
