import React from 'react'
import { connect } from 'react-redux'
import { ArrowRightIcon, ExternalLinkIcon } from '@heroicons/react/solid'
import { Link } from 'react-router-dom'

import components from 'components'
import services from 'services'


class Landing extends React.PureComponent {
  render() {
    return (
      <div className='max-w-md m-auto'>
        <div className='font-bold text-center mt-4 text-lg'>{'Avvy Domains'}</div>
        <div className='text-center max-w-sm m-auto mt-4 mb-8'>{'A naming service designed to support the Avalanche ecosystem and its various subnets.'}</div>
        <div className='mb-8'>
          <components.DomainSearch />
        </div>
        <Link
          to={services.linking.path('MyDomains')}
          className="flex justify-between bg-gray-100 font-bold p-4 rounded mb-2 dark:bg-gray-700">
          <div>{'My Domains'}</div>
          <ArrowRightIcon className="h-6" />
        </Link>
        {services.environment.REGISTRATIONS_ENABLED ? (
          <Link
            to={services.linking.path('Register')}
            className="flex justify-between bg-gray-100 font-bold p-4 rounded mb-2 dark:bg-gray-700">
            <div>{'Register a Name'}</div>
            <ArrowRightIcon className="h-6" />
          </Link>
        ) : null}
        <a href="https://avvy.domains/docs/"
          target="_blank"
          className="flex justify-between bg-gray-100 font-bold p-4 rounded mb-2 dark:bg-gray-700">
          <div>{'Documentation'}</div>
          <ExternalLinkIcon className="h-6" />
        </a>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Landing)
