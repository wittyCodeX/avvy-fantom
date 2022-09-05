import React from 'react'


class Select extends React.PureComponent {
  componentDidUpdate(prevProps) {
    if (this.props.initial !== prevProps.initial) {
      if (this.selectRef) {
        this.selectRef.value = this.props.initial
      }
    }
  }

  getValue() {
    return this.selectRef.value
  }

  addEventListener(event, func) {
    this.selectRef.addEventListener(event, func)
  }

  setInitial = (ref) => {
    if (ref) ref.value = this.props.initial
  }

  render() {
    return (
      <select className='bg-gray-100 dark:bg-gray-800 py-2 px-2 rounded-xl w-full' ref={(ref) => {
        this.selectRef = ref
        this.setInitial(ref)
      }} value={this.props.value}>
        {this.props.options.map((option, index) => {
          return (
            <option key={index} value={option.value}>{option.name}</option>
          )
        })}
      </select>
    )
  }
}

export default Select
