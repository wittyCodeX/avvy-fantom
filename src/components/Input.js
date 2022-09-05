import React from 'react'


class Input extends React.PureComponent {
  render() {
    return (
      <input className='bg-gray-100 dark:bg-gray-800 py-2 px-2 rounded-xl w-full' {...this.props} />
    )
  }
}

export default Input
