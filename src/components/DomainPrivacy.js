import React from 'react'
import { CheckCircleIcon } from '@heroicons/react/solid'

class DomainPrivacy extends React.PureComponent {
  render() {
    const error = this.props.error
    return (
      <>
        <div className="grid gap-2 grid-cols-1 md:grid-cols-1 w-full">
          <div
            onClick={() => this.props.onCheck(false)}
            className={`cursor-pointer bg-gray-100 dark:bg-gray-800 p-4 rounded-xl border-2 ${
              error
                ? 'border-red-500'
                : this.props.isEnhancedPrivacy
                ? 'border-gray-100 dark:border-gray-800'
                : 'border-gray-700 dark:border-white'
            }`}
          >
            <div className="font-bold flex items-center justify-between">
              <div className="">{'Standard Privacy'}</div>
              <div className={this.props.isEnhancedPrivacy ? 'hidden' : ''}>
                <CheckCircleIcon className="w-6 text-gray-700 dark:text-white" />
              </div>
            </div>
            <ul className="list-disc pl-4 mt-4 text-sm">
              <li>{'Anyone on the blockchain can read your domain names'}</li>
              <li>{'NFT exchanges can list your domain names'}</li>
              <li>{'Your wallet will always remember your domain names'}</li>
              <li>{'Reverse resolution will work for your domain names'}</li>
              <li>{'You cannot switch these names to Enhanced Privacy***'}</li>
            </ul>
          </div>
        </div>
      </>
    )
  }
}

export default DomainPrivacy
