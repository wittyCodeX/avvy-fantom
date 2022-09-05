import React from 'react'
import { CheckIcon } from '@heroicons/react/solid'


class Checkbox extends React.PureComponent {
  check = () => {
    if (this.props.onCheck) {
      this.props.onCheck()
    }
  }

  render() {
    return (
      <div className='flex items-flex-start cursor-pointer' onClick={this.check}>
        <div className={`mr-4 ${this.props.singleLine ? '' : 'mt-2'} w-6 h-6 border-2 border-gray-700 dark:border-gray-300 rounded flex-shrink-0 flex items-center justify-center`}>
          {this.props.checked ? (
            <CheckIcon className='w-6 text-gray-700 dark:text-gray-300' />
          ) : null}
        </div>
        <div className='text-gray-700 dark:text-gray-300'>
          {this.props.text}
        </div>
      </div>
    )
  }
}

class Button extends React.PureComponent {
  check = () => {
    if (this.props.onCheck) {
      this.props.onCheck()
    }
  }

  render() {
    return (
      <div className='flex items-center justify-center cursor-pointer bg-gray-100 dark:bg-gray-800 rounded-xl p-4' onClick={this.check}>
        <div className='mr-4 w-6 h-6 border-2 border-gray-700 dark:border-gray-300 rounded flex-shrink-0 flex items-center justify-center'>
          {this.props.checked ? (
            <CheckIcon className='w-6 text-gray-700 dark:text-gray-300' />
          ) : null}
        </div>
        <div className='text-gray-700 dark:text-gray-300'>
          {this.props.text}
        </div>
      </div>
    )
  }
}

const exports = {
  Checkbox,
  Button,
}

export default exports
