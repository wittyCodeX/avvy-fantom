import React from 'react'
import { connect } from 'react-redux'
import { ArrowCircleRightIcon } from '@heroicons/react/solid'

import components from 'components'
import services from 'services'

class ContinueRegistration extends React.PureComponent {
  componentDidMount() {
    services.linking.addEventListener(services.linking.EVENTS.ROUTE_CHANGED, this.handleRouteChange.bind(this))
  }

  componentWillUnmount() {
    services.linking.removeEventListener(services.linking.EVENTS.ROUTE_CHANGED, this.handleRouteChange.bind(this))
  }

  handleRouteChange() {
    this.forceUpdate()
  }

  render() {
    if (!this.props.cartNames || this.props.cartNames.length === 0) return null
    if (window.location.pathname === services.linking.path('Register')) return null
    return (
      <div className='mb-4 w-full'>
        <components.buttons.Transparent onClick={(navigator) => services.linking.navigate(navigator, 'Register')}>
          <div className='text-xs w-full bg-alert-blue text-white p-2 text-center cursor-pointer'>
            <div className='font-bold flex items-center justify-center'>
              <span className='w-4' />
              {this.props.cartNames.length === 1 ? 'You have an incomplete domain registration' : 'You have incomplete domain registrations'}
              <ArrowCircleRightIcon className='text-white w-4 ml-4' />
            </div>
          </div>
        </components.buttons.Transparent>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  cartNames: services.cart.selectors.names(state),
})

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(ContinueRegistration)
