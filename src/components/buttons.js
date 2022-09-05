import { useNavigate } from 'react-router-dom'

import components from 'components'

function Button(props) {
  let navigator = useNavigate()

  const onClick = (e) => {
    e.preventDefault()
    if (props.disabled) return
    if (props.loading) return
    if (props.onClick) props.onClick(navigator)
  }

  return (
    <div onClick={onClick} className={`relative rounded-xl ${props.sm ? `p-2 text-sm` : `p-4`} ${props.disabled ? 'bg-gray-100 text-gray-300 dark:bg-gray-800 dark:text-gray-600' : 'cursor-pointer bg-grayish-300 text-white dark:bg-gray-700'} select-none font-bold text-center flex items-center justify-center ${props.className ? props.className : ''}`}>
      {props.loading ? (
        <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center'>
          <components.Spinner className='w-6'/>
        </div>
      ) : null}
      <span className={props.loading ? 'invisible' : ''}>{props.text}</span>
    </div>
  )
}

function Transparent(props) {
  let navigator = useNavigate()

  const onClick = (e) => {
    e.preventDefault()
    if (props.onClick) props.onClick(navigator)
  }

  return (
    <div onClick={onClick}>
      {props.children}
    </div>
  )
}

const exports = {
  Button,
  Transparent,
}

export default exports
