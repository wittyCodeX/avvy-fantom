import React from 'react'


class Modal extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      open: props.open === true ? true : false,
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.show && !prevProps.show) {
      this.setState({
        open: true
      })
    }
  }

  toggle() {
    if (this.state.open && this.props.onClose) {
      const result = this.props.onClose()
      if (!result) return
    }
    this.setState(state => ({
      open: !state.open
    }), () => {
      if (this.state.open && this.props.onOpen) {
        this.props.onOpen()
      }
    })
  }

  hide() {
    if (this.state.open) this.toggle()
  }

  render() {
    const open = this.state.open
    return (
      <div className={`duration-150 transition-all flex items-center justify-center z-10 fixed top-0 left-0 w-full h-full ${open ? 'pointer-events-all opacity-100' : 'pointer-events-none opacity-0'}`}>
        <div onClick={this.toggle.bind(this)} className='absolute top-0 left-0 z-0 w-full h-full backdrop-blur-sm'></div>
        <div className='bg-black opacity-25 z-10 absolute top-0 left-0 w-full h-full pointer-events-none'></div>
        <div onClick={(e) => e.stopPropagation()} className='m-4 bg-white dark:bg-gray-900 rounded max-w-screen-md max-h-screen w-full border-gray-200 dark:border-gray-700 border p-4 shadow relative z-20 overflow-y-auto'>
          {this.props.title ? (
            <div className='font-bold border-b border-gray-400 pb-4 mb-4'>{this.props.title}</div>
          ) : null}
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default Modal
