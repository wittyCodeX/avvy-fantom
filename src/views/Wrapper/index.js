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
      <div
        className={`font-poppins`}
        style={{
          backgroundImage: `url(${services.linking.static('images/bg.svg')})`,
        }}
      >
        <components.Modal ref={(ref) => (this.searchModal = ref)}>
          <div className="font-bold"></div>
          <components.DomainSearch
            onBeforeSubmit={() => this.searchModal.toggle()}
            modal={true}
          />
        </components.Modal>
        <components.Modal ref={(ref) => (this.browserModal = ref)}>
          <div className="font-bold"></div>
          <components.UpcomingNews />
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
                  alt="FNS Domains"
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

            <div
              className="block text-lg p-2 w-full h-16 flex items-center justify-between"
              onClick={() => {
                this.browserModal.toggle()
                this.toggleMenu.bind(this)
              }}
            >
              <div>Open Browser</div>
              <ArrowRightIcon className="w-6" />
            </div>
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
              <a href="https://fantom.foundation">
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
                    alt="FNS Domains"
                  />
                </div>
                <div className="text-left ml-1 md:ml-3 dark:text-white">
                  <div className="font-arial uppercase text-md md:text-xl">
                    FNS
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
              <div className="font-poppins ml-4 text-md">
                <div
                  className="py-8 px-4 cursor-pointer"
                  onClick={() => this.searchModal.toggle()}
                >
                  <SearchIcon className="w-6" />
                </div>
              </div>
              <div className="font-poppins ml-8 text-md">
                <Link to={services.linking.path('MyDomains')}>My Domains</Link>
              </div>
              <div className="font-poppins ml-4 text-md">
                <div
                  className="py-8 px-4 cursor-pointer"
                  onClick={() => this.browserModal.toggle()}
                >
                  Open Browser
                </div>
              </div>
              <div className="font-poppins mr-4 text-md">
                <div
                  className="px-4 cursor-pointer"
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
          </div>
        </div>

        {/* Content */}
        <div className="h-16 md:h-24"></div>
        <components.ContinueRegistration />
        <div className="max-w-screen-xl m-auto p-16 min-h-screen">
          {this.props.children}
        </div>

        {/* Cart */}
        <div className="absolute bottom-0 w-full"></div>
        {/* Footer */}
        <footer className="fixed bottom-0 w-full  border-t-2 border-gray-100 bg-white dark:bg-gray-900 dark:border-gray-700 z-10">
          <div className="w-full mx-auto px-4 sm:px-6">
            {/* Bottom area */}
            <div className="md:flex md:items-center md:justify-between py-1 border-t border-gray-200">
              {/* Social links */}
              <ul className="flex mb-4 md:order-1 md:ml-4 md:mb-0 justify-center">
                {/* <li>
                  <Link
                    to="#"
                    className="flex justify-center items-center text-gray-600 hover:text-gray-900 bg-white hover:bg-white-100 rounded-full shadow transition duration-150 ease-in-out"
                    aria-label="Twitter"
                  >
                    <svg
                      className="w-8 h-8 fill-current"
                      viewBox="0 0 32 32"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M24 11.5c-.6.3-1.2.4-1.9.5.7-.4 1.2-1 1.4-1.8-.6.4-1.3.6-2.1.8-.6-.6-1.5-1-2.4-1-1.7 0-3.2 1.5-3.2 3.3 0 .3 0 .5.1.7-2.7-.1-5.2-1.4-6.8-3.4-.3.5-.4 1-.4 1.7 0 1.1.6 2.1 1.5 2.7-.5 0-1-.2-1.5-.4 0 1.6 1.1 2.9 2.6 3.2-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.3 1.6 2.3 3.1 2.3-1.1.9-2.5 1.4-4.1 1.4H8c1.5.9 3.2 1.5 5 1.5 6 0 9.3-5 9.3-9.3v-.4c.7-.5 1.3-1.1 1.7-1.8z" />
                    </svg>
                  </Link>
                </li>
                <li className="ml-4">
                  <Link
                    to="#"
                    className="flex justify-center items-center text-gray-600 hover:text-gray-900 bg-white hover:bg-white-100 rounded-full shadow transition duration-150 ease-in-out"
                    aria-label="Github"
                  >
                    <svg
                      className="w-8 h-8 fill-current"
                      viewBox="0 0 32 32"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M16 8.2c-4.4 0-8 3.6-8 8 0 3.5 2.3 6.5 5.5 7.6.4.1.5-.2.5-.4V22c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.3 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.7-3.7 3.9.3.4.6.9.6 1.6v2.2c0 .2.1.5.6.4 3.2-1.1 5.5-4.1 5.5-7.6-.1-4.4-3.7-8-8.1-8z" />
                    </svg>
                  </Link>
                </li>
                <li className="ml-4">
                  <Link
                    to="#"
                    className="flex justify-center items-center text-gray-600 hover:text-gray-900 bg-white hover:bg-white-100 rounded-full shadow transition duration-150 ease-in-out"
                    aria-label="Facebook"
                  >
                    <svg
                      className="w-8 h-8 fill-current"
                      viewBox="0 0 32 32"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M14.023 24L14 17h-3v-3h3v-2c0-2.7 1.672-4 4.08-4 1.153 0 2.144.086 2.433.124v2.821h-1.67c-1.31 0-1.563.623-1.563 1.536V14H21l-1 3h-2.72v7h-3.257z" />
                    </svg>
                  </Link>
                </li> */}
              </ul>

              {/* Copyrights note */}
              <div className="text-sm text-gray-600 mr-4">
                <div className="w-32 m-auto">
                  <a href="https://fantom.foundation">
                    <img
                      src={services.linking.static('images/ftm.png')}
                      alt="Powered by Fantom."
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
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
