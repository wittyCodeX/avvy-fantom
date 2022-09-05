import React from 'react'
import { connect } from 'react-redux'
import { ethers } from 'ethers'
import { useNavigate } from 'react-router-dom'

import actions from './actions'
import selectors from './selectors'

import components from 'components'
import services from 'services'


class SetResolver extends React.PureComponent {
  constructor(props) {
    super(props)
    this.setWalletAddress()
    this.state = {
      walletAddress: null,
    }
  }

  setWalletAddress = async () => {
    const api = await services.provider.buildAPI()
    this.setState({
      walletAddress: api.account
    })
  }

  submit = async () => {
    this.props.setEVMReverseRecord(this.props.domain)
  }

  render() {
    if (this.props.complete) return (
      <>
        <div className='max-w-md m-auto'>
          <components.labels.Success text={'Reverse Record for C-Chain / EVM has been set'} />
        </div>
        <div className='max-w-md m-auto mt-4'>
          <components.buttons.Button text={'Close'} onClick={() => {
            this.props.reset()
            this.props.onComplete()
          }} />
        </div>
      </>
    )

    return (
      <>
        <div className='max-w-md m-auto'>
          <div className='font-bold mt-8'>
            {'What is this?'}
          </div>
          <div className='mb-2'>
            {'This feature sets '} {this.props.domain} {'as the name associated with your connected wallet (' + this.state.walletAddress + ')'}
          </div>
          <div className='mb-2'>
            {'Applications can then find your .avax name if they know your wallet address.'}
          </div>
          <div className='mt-8'>
            <components.buttons.Button sm={true} text={'Set Reverse Record'} onClick={() => this.submit()} loading={this.props.loading} />
          </div>
        </div>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  loading: selectors.isSettingEVMReverseRecord(state),
  complete: selectors.isSettingEVMReverseRecordComplete(state),
})

const mapDispatchToProps = (dispatch) => ({
  setEVMReverseRecord: (domain) => dispatch(actions.setEVMReverseRecord(domain)),
  reset: () => dispatch(actions.resetSetEVMReverseRecord()),
})

export default connect(mapStateToProps, mapDispatchToProps)(SetResolver)
