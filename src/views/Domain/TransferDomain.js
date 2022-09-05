import React from 'react'
import { connect } from 'react-redux'
import { ethers } from 'ethers'
import { useNavigate } from 'react-router-dom'

import actions from './actions'
import selectors from './selectors'

import components from 'components'
import services from 'services'


class TransferDomain extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      newOwner: '',
    }
  }

  submit = async () => {
    this.props.transferDomain(this.props.domain, this.state.newOwner)
  }

  render() {
    if (this.props.complete) return (
      <>
        <div className='max-w-md m-auto'>
          <components.labels.Success text={'Domain has been transferred'} />
        </div>
        <div className='max-w-md m-auto mt-4'>
          <components.buttons.Button text={'Close'} onClick={() => this.props.onComplete()} />
        </div>
      </>
    )

    return (
      <>
        <div className='max-w-md m-auto'>
          <components.labels.Information text={'This will transfer the domain registration of ' + this.props.domain + ' to a new owner.'} />
          <div className='font-bold mb-2 mt-4'>
            New Owner
          </div>
          <components.Input value={this.state.newOwner} type="text" onChange={(e) => this.setState({
            newOwner: e.target.value
          })} />
          {this.props.error ? (
            <div className='mt-8'>
              <components.labels.Error text={this.props.error} />
            </div>
          ) : null}
          <div className='mt-8'>
            <components.buttons.Button sm={true} text={'Submit'} onClick={() => this.submit()} loading={this.props.loading} />
          </div>
        </div>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  loading: selectors.isTransferringDomain(state),
  complete: selectors.transferDomainSuccess(state),
  error: selectors.transferDomainError(state),
})

const mapDispatchToProps = (dispatch) => ({
  transferDomain: (domain, address) => dispatch(actions.transferDomain(domain, address)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TransferDomain)
