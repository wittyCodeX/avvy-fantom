import React from 'react'
import { ethers } from 'ethers'
import { useNavigate } from 'react-router-dom'

import components from 'components'

function _AddBid(props) {
  let inputRef
  let navigate = useNavigate()

  const handleSubmit = () => {
    let val
    try {
      val = ethers.utils.parseEther(inputRef.value)
    } catch (err) {
      return alert('Please enter a valid number')
    }
    if (val.lt(ethers.BigNumber.from('0')))
      return alert('Cannot bid lower than zero')
    props.handleSubmit(navigate, val.toString())
  }

  return (
    <>
      <components.labels.Information
        text={
          'Enter the maximum amount you would be willing to pay to win the auction. This is a sealed-bid second-price (Vickrey) auction. If you win the auction, you will pay the amount of the second-highest bid as auction fees. If there are no other bids, you will win the auction and pay no auction fees. You should have enough FTM to cover all bids that you place, in the event that you win all of the auctions.'
        }
      />
      <div className="mt-8 font-bold text-center">{props.domain}</div>
      <div className="mt-2 bg-gray-100 rounded-lg w-full text-gray-700 p-4 flex items-center justify-center max-w-md m-auto dark:bg-gray-800">
        <div className="w-20 mr-2 font-bold flex-shrink-0 dark:text-gray-200">
          {'Your bid:'}
        </div>
        <div
          className="bg-white rounded flex items-center cursor-pointer dark:bg-gray-900"
          onClick={() => inputRef.focus()}
        >
          <input
            min={0}
            type="number"
            className="w-32 text-center bg-white rounded-lg p-4 dark:bg-gray-900 dark:text-gray-200"
            ref={(ref) => (inputRef = ref)}
          />
          <div className="h-full ml-2 text-center mr-4 text-gray-400">
            {'FTM'}
          </div>
        </div>
      </div>
      <div className="mt-8 max-w-sm m-auto">
        <components.buttons.Button text={'Add Bid'} onClick={handleSubmit} />
      </div>
    </>
  )
}

class AddBid extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      hasReadDocs: false,
      hasClickedContinue: false,
    }
  }

  render() {
    if (this.props.hasSeenBidDisclaimer || this.state.hasClickedContinue) {
      return <_AddBid {...this.props} />
    }
    return (
      <>
        <div className="mt-4 max-w-md m-auto">
          {'Please be sure to read the '}
          <a
            className="underline"
            href="https://avvy.domains/docs/sunrise-auction/"
            target="_blank"
          >
            Documentation on the Sunrise Auction
          </a>
          {' before placing any bids.'}
        </div>
        <div className="mt-4 max-w-md m-auto">
          <components.checkbox.Button
            text="I have read the documentation"
            checked={this.state.hasReadDocs}
            onCheck={() => this.setState({ hasReadDocs: true })}
          />
        </div>
        <div className="mt-4 max-w-md m-auto">
          <components.buttons.Button
            text="Continue"
            disabled={!this.state.hasReadDocs}
            onClick={() => this.props.setHasSeenBidDisclaimer(true)}
          />
        </div>
      </>
    )
  }
}

export default AddBid
