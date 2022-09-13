import React from 'react'
import { CheckCircleIcon } from '@heroicons/react/solid'

class DomainPrivacy extends React.PureComponent {
  render() {
    const error = this.props.error
    return (
      <>
        <div className="grid gap-2 grid-cols-1 md:grid-cols-2 w-full">
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
          <div
            onClick={() => this.props.onCheck(true)}
            className={`cursor-pointer bg-gray-100 dark:bg-gray-800 p-4 rounded-xl border-2 ${
              error
                ? 'border-red-500'
                : this.props.isEnhancedPrivacy
                ? 'border-gray-700 dark:border-white'
                : 'border-gray-100 dark:border-gray-800'
            }`}
          >
            <div className="font-bold flex items-center justify-between">
              <div className="">{'Enhanced Privacy'}</div>
              <div className={this.props.isEnhancedPrivacy ? '' : 'hidden'}>
                <CheckCircleIcon className="w-6 text-gray-700 dark:text-white" />
              </div>
            </div>
            <ul className="list-disc pl-4 mt-4 text-sm">
              <li>
                {'Others will have difficulty reading your domain names*'}
              </li>
              <li>{'NFT exchanges cannot list your domain names*'}</li>
              <li>{'Your wallet will not remember your domain names**'}</li>
              <li>
                {'Reverse resolution will not work for your domain names'}
              </li>
              <li>
                {
                  'You can switch these names to Standard Privacy in the future***'
                }
              </li>
            </ul>
          </div>
        </div>
        <div className="text-gray-500 text-xs mt-4">
          <div>
            {
              '* Enhanced Privacy uses hashing to obfuscate your domain name - this is a weak privacy layer which can be attacked'
            }
          </div>
          <div>
            {
              '** With Enhanced Privacy, you must remember the domain name you have registered or back up your data'
            }
          </div>
          <div>
            {
              '*** Enabling Enhanced Privacy for names that were previously registered with Standard Privacy will have no effect'
            }
          </div>
          <div className="mt-4">
            <a
              target="_blank"
              rel="noreferrer"
              href="https://fns.domains/docs/privacy-features-registrations/"
              className="underline"
            >
              {'Read more about Enhanced Privacy'}
            </a>
          </div>
        </div>
      </>
    )
  }
}

export default DomainPrivacy
