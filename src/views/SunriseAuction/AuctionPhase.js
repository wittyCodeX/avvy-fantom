import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRightIcon, CheckIcon } from '@heroicons/react/solid'
import { CalendarIcon } from '@heroicons/react/outline'

import services from 'services'


class AuctionPhase extends React.PureComponent {
  render() {
    const active = Date.now() >= this.props.startsAt && Date.now() < this.props.endsAt
    const past = Date.now() >= this.props.endsAt
    return (
      <Link 
        to={services.linking.path('SunriseAuctionMyBids')}
        className={`flex rounded-xl border-2 ${active ? 'border-grayish-300 bg-grayish-300 dark:bg-gray-300 dark:border-gray-300 cursor-pointer' : 'bg-gray-300 border-gray-300 dark:bg-gray-700 dark:border-gray-700 cursor-default pointer-events-none'} overflow-hidden`}
      >
        <div className={`${active ? 'bg-grayish-300 dark:bg-gray-300' : 'bg-gray-300 dark:bg-gray-700'} w-16 flex-shrink-0 flex items-center justify-center`}>
          {active ? (
            <ArrowRightIcon className='h-8 text-white dark:text-gray-800' />
          ) : past ? (
            <CheckIcon className='h-8 text-white' />
          ) : (
            <CalendarIcon className='h-8 text-white' />
          )}
        </div>
        <div className='bg-white p-4 w-full dark:bg-gray-900'> 
          <div className='font-bold'>{this.props.name}</div>
          <div className='text-sm'>
            {new Intl.DateTimeFormat(
              navigator.language,
              { month: 'short', day: 'numeric', year: 'numeric' }
            ).format(this.props.startsAt)}
            {' at '}
            {new Intl.DateTimeFormat(
              navigator.langauge,
              { hour: 'numeric', minute: 'numeric' }
            ).format(this.props.startsAt)}
          </div>
        </div>
      </Link>
    )
  }
}

export default AuctionPhase
