import React from 'react'
import { connect } from 'react-redux'

import components from 'components'

import actions from './actions'
import selectors from './selectors'


function CreateAccountForm(props) {
  let name = React.createRef()
  let email = React.createRef()
  
  const handleSubmit = (e) => {
    props.onSubmit(name.current.value, email.current.value)
  }
  
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className='pb-2 pl-2 text-gray-700 text-sm uppercase font-bold'>Name</div>
        <div className='bg-gray-100 rounded-xl w-full text-center relative'>
          <input disabled={props.complete} autoComplete="off" ref={name} autoCapitalize="off" className='bg-transparent w-full placeholder:text-gray-400 text-black text-center p-4' />
        </div>
        <div className='pb-2 pl-2 center text-gray-700 text-sm uppercase mt-4 font-bold'>Email Address</div>
        <div className='bg-gray-100 rounded-xl w-full text-center relative'>
          <input disabled={props.complete} type="email" autoComplete="off" ref={email} autoCapitalize="off" className='bg-transparent w-full placeholder:text-gray-400 text-black text-center p-4' />
        </div>
        {props.complete === true ? (
          <div className='my-4'>
            <components.labels.Success text={'Your account has been created. Please check your email for further instructions.'} />
          </div>
        ) : null}
        {props.error ? (
          <div className='my-4'>
            <components.labels.Error text={props.error} />
          </div>
        ) : null}
        {props.complete ? (
          <div className='w-full h-1 bg-gray-100 py-2'></div>
        ) : (
          <div className='mt-4'>
            <components.buttons.Button text='Create account' onClick={() => handleSubmit()} loading={props.loading} />
          </div>
        )}
      </form>
    </>
  )
}

class CreateAccount extends React.PureComponent {
  componentDidMount() {
    this.props.reset()
  }

  handleCreateAccount = (name, email) => {
    this.props.createAccount(name, email)
  }
  
  render() {
    return (
      <>
        <div className='relative max-w-sm m-auto mt-8'>
          <div className='text-center pb-4 font-bold text-xl'>Create Account</div>
          <CreateAccountForm onSubmit={this.handleCreateAccount} loading={this.props.loading} error={this.props.error} complete={this.props.isComplete} />
        </div>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  loading: selectors.createAccountLoading(state),
  error: selectors.createAccountError(state),
  isComplete: selectors.createAccountComplete(state),
})

const mapDispatchToProps = (dispatch) => ({
  reset: () => dispatch(actions.resetCreateAccount()),
  createAccount: (name, email) => dispatch(actions.createAccount(name, email)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateAccount)
