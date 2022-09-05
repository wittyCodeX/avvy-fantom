import { CheckCircleIcon } from '@heroicons/react/solid'
import { InformationCircleIcon } from '@heroicons/react/outline'

function Label(props) {
  const iconSize = {
    'md': 'w-6',
    'xs': 'w-4',
  }[props.size || 'md']
  const iconMargin = {
    'md': 'ml-2',
    'xs': 'ml-1',
  }[props.size || 'md']
  const textSize = {
    'md': '',
    'xs': 'text-xs',
  }[props.size || 'md']
  return (
    <div className={`flex items-start ${props.justify || 'justify-center'}`}>
      <props.icon className={`${iconSize} ${props.color} flex-shrink-0 ${props.extraIconClass}`} />
      <div className={`${props.color} ${iconMargin} ${textSize} ${props.extraTextClass}`}>{props.text}</div>
    </div>
  )
}

function Information(props) {
  return <Label icon={InformationCircleIcon} color='text-gray-400' {...props}  />
}

function Warning(props) {
  return <Label icon={InformationCircleIcon} color='text-alert-orange' {...props} />
}

function Error(props) {
  return <Label icon={InformationCircleIcon} color='text-alert-red' {...props} />
}

function Success(props) {
  return <Label icon={CheckCircleIcon} color='text-alert-blue' {...props} />
}

const exports = {
  Information,
  Error,
  Success,
  Warning,
}

export default exports
