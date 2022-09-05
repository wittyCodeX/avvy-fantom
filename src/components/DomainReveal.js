import React from 'react'
import { connect } from 'react-redux'
import { SearchIcon } from '@heroicons/react/solid'

import services from 'services'

function DomainReveal(props) {
  let onBeforeSubmit = props.onBeforeSubmit
  let textInput = React.createRef()
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (onBeforeSubmit) onBeforeSubmit()
    let domain = textInput.current.value.toLowerCase()
    textInput.current.value = ''
    const domainSplit = domain.split('.')
    if (domainSplit.length === 1) {
      domain = domain + '.avax'
    }
    props.reveal(domain)
    if (props.onReveal) setTimeout(props.onReveal, 10)
  }
  
  return (
    <div className='bg-gray-100 rounded-xl w-full text-center relative dark:bg-gray-800'>
      <form onSubmit={handleSubmit}>
        <input autoComplete="off" ref={textInput} autoCapitalize="off" placeholder={props.placeholder || 'Reveal domain names'} className='bg-transparent w-full placeholder:text-gray-400 text-black dark:text-gray-300 text-center p-4' />
      </form>
      <div className='absolute right-0 top-0 h-full flex items-center justify-center mr-4 cursor-pointer' onClick={handleSubmit}>
        <SearchIcon className='w-6 text-gray-300' />
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = (dispatch) => ({
  reveal: (domain) => dispatch(services.names.actions.addRecordWithoutHash(domain)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DomainReveal)
