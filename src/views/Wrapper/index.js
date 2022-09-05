import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { ArrowRightIcon, SearchIcon } from '@heroicons/react/solid'
import { MoonIcon, SunIcon, CogIcon } from '@heroicons/react/outline'

import components from 'components'
import services from 'services'

class Wrapper extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      menuOpen: false,
    }
  }

  toggleMenu = () => {
    this.setState((state) => ({
      menuOpen: !state.menuOpen,
    }))
  }

  toggleDarkmode = () => {
    this.props.setDarkmode(!this.props.isDarkmode)
  }

  render() {
    return (
      <div className={`font-poppins`}>
        <components.Modal ref={(ref) => (this.searchModal = ref)}>
          <div className="font-bold"></div>
          <components.DomainSearch
            onBeforeSubmit={() => this.searchModal.toggle()}
          />
        </components.Modal>

        {/* Mobile menu */}
        <div
          className="fixed top-0 bg-white dark:bg-gray-900 h-full left-0 w-screen z-10 transition-all"
          style={{
            left: '100%',
            transform: this.state.menuOpen
              ? 'translateX(-100%)'
              : 'translateX(0)',
          }}
        >
          <div
            className="absolute top-0 right-0 p-4 cursor-pointer"
            onClick={this.toggleMenu.bind(this)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <div className="font-poppins flex-col flex items-center h-full p-4">
            <Link
              to={services.linking.path('Landing')}
              onClick={this.toggleMenu.bind(this)}
            >
              <div
                className="dark:bg-white mb-4"
                style={{ borderRadius: '500px' }}
              >
                <img
                  src={services.linking.static('images/logo.png')}
                  className="w-12 md:w-14 m-auto dark:w-12 dark:md:w-12"
                  alt="FTMVY Domains"
                />
              </div>
            </Link>
            <div className="mb-2 w-full">
              <components.DomainSearch
                onBeforeSubmit={this.toggleMenu.bind(this)}
              />
            </div>
            <Link
              className="block text-lg p-2 w-full h-16 flex items-center justify-between"
              to={services.linking.path('MyDomains')}
              onClick={this.toggleMenu.bind(this)}
            >
              <div>My Domains</div>
              <ArrowRightIcon className="w-6" />
            </Link>
            <div className="w-full h-1 bg-gray-100 dark:bg-gray-800"></div>
            <Link
              className="block text-lg p-2 w-full h-16 flex items-center justify-between"
              to={services.linking.path('Settings')}
              onClick={this.toggleMenu.bind(this)}
            >
              <div>Settings</div>
              <ArrowRightIcon className="w-6" />
            </Link>
            <div className="w-full h-1 bg-gray-100 dark:bg-gray-800"></div>
            <div>
              <div className="font-poppins mr-4 text-md">
                <div
                  className="py-8 px-4 cursor-pointer"
                  onClick={() => this.props.setDarkmode(!this.props.isDarkmode)}
                >
                  {this.props.isDarkmode ? (
                    <SunIcon className="w-6" />
                  ) : (
                    <MoonIcon className="w-6" />
                  )}
                </div>
              </div>
            </div>
            <div className="h-24"></div>
          </div>
          <div className="absolute bottom-0 mb-8 text-center w-full">
            <div className="w-32 m-auto">
              <a href="https://ftm.network">
                <img
                  src={services.linking.static('images/ftm.png')}
                  alt="Powered by Fantom."
                />
              </a>
            </div>
          </div>
        </div>

        {/* Page header */}
        <div className="fixed top-0 w-full h-16 md:h-24 border-b-2 border-gray-100 bg-white dark:bg-gray-900 dark:border-gray-700 z-10">
          <div className="text-center flex items-center justify-between w-full h-full max-w-screen-xl m-auto">
            <Link to={services.linking.path('Landing')}>
              <div className="h-full ml-1 md:ml-6 items-center justify-center flex">
                <div
                  className="dark:bg-white dark:mx-2"
                  style={{ borderRadius: '500px' }}
                >
                  <img
                    src={services.linking.static('images/logo.png')}
                    className="w-12 md:w-14 m-auto dark:w-8 dark:md:w-12"
                    alt="FTMVY Domains"
                  />
                </div>
                <div className="text-left ml-1 md:ml-3 dark:text-white">
                  <div className="font-zen uppercase text-md md:text-xl">
                    FTMVY
                  </div>
                  <div
                    className="font-poppins text-xs md:text-sm"
                    style={{ marginTop: '-4px' }}
                  >
                    The Fantom Name Service
                  </div>
                </div>
              </div>
            </Link>
            <div
              className="p-3 md:hidden cursor-pointer"
              onClick={this.toggleMenu.bind(this)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </div>
            <div className="pr-8 hidden md:flex items-center dark:text-white">
              <div className="font-poppins ml-8 text-md">
                <Link to={services.linking.path('MyDomains')}>My Domains</Link>
              </div>
              <div className="font-poppins ml-4 text-md">
                <div
                  className="py-8 px-4 cursor-pointer"
                  onClick={() => this.searchModal.toggle()}
                >
                  <SearchIcon className="w-6" />
                </div>
              </div>
              <div className="font-poppins mr-4 text-md">
                <div
                  className="py-8 px-4 cursor-pointer"
                  onClick={() => this.props.setDarkmode(!this.props.isDarkmode)}
                >
                  {this.props.isDarkmode ? (
                    <SunIcon className="w-6" />
                  ) : (
                    <MoonIcon className="w-6" />
                  )}
                </div>
              </div>
              <div className="font-poppins text-md">
                <Link
                  className="py-8 px-4 cursor-pointer"
                  to={services.linking.path('Settings')}
                >
                  <CogIcon className="w-6" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="h-16 md:h-24"></div>
        <components.ContinueRegistration />
        <div className="max-w-screen-xl m-auto p-4">{this.props.children}</div>

        {/* Cart */}
        <div className="absolute bottom-0 w-full"></div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isDarkmode: services.darkmode.selectors.isDarkmode(state),
})

const mapDispatchToProps = (dispatch) => ({
  setDarkmode: (value) =>
    dispatch(services.darkmode.actions.setDarkmode(value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Wrapper)
