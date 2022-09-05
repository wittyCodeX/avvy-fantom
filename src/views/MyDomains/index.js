import React from 'react'
import { connect } from 'react-redux'
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'
import { Link } from 'react-router-dom'

import components from 'components'
import services from 'services'


class MyDomains extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      paginationIndex: 0,
    }
  }

  componentDidMount() {
    services.provider.addEventListener(services.provider.EVENTS.CONNECTED, this.onConnect.bind(this))
    this.loadDomains()
  }

  componentWillUnmount() {
    services.provider.addEventListener(services.provider.EVENTS.CONNECTED, this.onConnect.bind(this))
  }

  onConnect() {
    if (this.connectModal) {
      this.connectModal.hide()
    }
    this.loadDomains()
  }

  loadDomains() {
    if (services.provider.isConnected()) {
      this.props.loadDomains()
    }
  }

  renderSealedDomain(hash, index) {
    return (
      <>
        Hidden
      </>
    )
  }

  renderRevealedDomain(hash, index) {
    const reverseLookups = this.props.reverseLookups
    const domain = reverseLookups[hash] 
    return (
      <Link
        key={index}
        to={services.linking.path('Domain', { domain })}
        className="flex justify-between bg-gray-100 dark:bg-gray-800 font-bold p-4 rounded mb-2">
        <div>{domain}</div>
        <ArrowRightIcon className="h-6" />
      </Link>
    )
  }

  renderHiddenDomainsNotice(domainCount) {
    return (
      <div className='mb-4'>
        <components.labels.Information text={`You have ${domainCount} unrevealed Enhanced Privacy ${domainCount === 1 ? 'domain' : 'domains'} in your wallet.`} />
        <div className='max-w-md m-auto'>
          <div className='mt-4 text-gray-700'>
            {"Enhanced Privacy Domains are hidden on-chain so that an observers have difficulty knowing which domains you have registered. To reveal your domains, search for them below."}
          </div>
          <div className='mt-4 mb-8'>
            <components.DomainReveal />
          </div>
        </div>
      </div>
    )
  }

  renderPagination(numPages) {
    numPages = Math.ceil(numPages)
    const currPage = this.state.paginationIndex
    let pagesDisplayed = []
    const maxPagesToDisplay = 5
    if (currPage === 0 || currPage === 1) {
      for (let i = 0; i < numPages; i += 1) {
        pagesDisplayed.push(i+1)
        if (pagesDisplayed.length >= maxPagesToDisplay) break
      }
    } else if (currPage === numPages - 1 || currPage === numPages - 2) {
      for (let i = numPages - 5; i < numPages; i += 1) {
        if (i + 1 > 0) {
          pagesDisplayed.push(i+1)
        }
        if (pagesDisplayed.length >= maxPagesToDisplay) break
      }
    } else {
      pagesDisplayed = [
        currPage - 1,
        currPage,
        currPage + 1,
        currPage + 2,
        currPage + 3,
      ]
    }
    return (
      <div className='flex items-center justify-center'>
        <div 
          onClick={() => {
            this.setState(currState => {
              const currPage = this.state.paginationIndex
              const nextPage = currPage === 0 ? currPage : currPage - 1
              return {
                paginationIndex: nextPage
              }
            })
          }}
          className='dark:bg-gray-800 bg-gray-100 rounded-lg select-none w-12 h-12 flex items-center justify-center mr-2 cursor-pointer'>
          <ChevronLeftIcon className='w-6' />
        </div>
        {pagesDisplayed.map((p, index) => (
          <div 
            onClick={() => {
              this.setState({
                paginationIndex: p - 1
              })
            }}
            className={`dark:bg-gray-800 cursor-pointer select-none bg-gray-100 rounded-lg w-12 h-12 flex items-center justify-center mr-2 ${currPage === p - 1 ? 'font-bold' : ''}`} key={index}>{p}
          </div>
        ))}
        <div 
          onClick={() => {
            this.setState(currState => {
              const currPage = this.state.paginationIndex
              const nextPage = currPage >= numPages - 1 ? currPage : currPage + 1
              return {
                paginationIndex: nextPage
              }
            })
          }}
          className='dark:bg-gray-800 bg-gray-100 rounded-lg select-none w-12 h-12 flex items-center justify-center mr-2 cursor-pointer'>
          <ChevronRightIcon className='w-6' />
        </div>
      </div>
    )
  }

  renderDomains() {
    const reverseLookups = this.props.reverseLookups
    let domains = this.props.domainIds.filter(domain => reverseLookups[domain])
    const hiddenDomainCount = this.props.domainIds.length - domains.length
    const pageLength = 10
    const hasPagination = domains.length > pageLength
    const numPages = domains.length / pageLength
    domains = domains.slice(this.state.paginationIndex * pageLength, this.state.paginationIndex * pageLength + pageLength)

    return (
      <div className='mt-8'>
        {hiddenDomainCount > 0 ? this.renderHiddenDomainsNotice(hiddenDomainCount) : null}
        {domains.map((domain, index) => this.renderRevealedDomain(domain, index))}
        {hasPagination ? this.renderPagination(numPages) : null}
      </div>
    )
  }

  renderEmpty() {
    return (
      <div className='max-w-md m-auto'>
        <components.labels.Information text={'You do not have any registered domains'} />
        <div className='mt-8'>
          <components.DomainSearch />
        </div>
      </div>
    )
  }

  renderNotConnected() {
    return (
      <div className='max-w-md m-auto'>
        <components.labels.Information text={'You must be connected to a wallet to view your domains'} />
        <div className='mt-8'>
          <components.buttons.Button text={'Connect your wallet'} onClick={() => this.connectModal.toggle()} />
        </div>
      </div>
    )
  }

  renderDomainSection() {
    const domainCount = this.props.domainCount 
    const loadedDomainCount = this.props.loadedDomainCount
    const pct = parseInt((loadedDomainCount / domainCount) * 100)

    if (!services.provider.isConnected()) return this.renderNotConnected()
    if (domainCount === null) return (
      <div className='text-center w-full mt-8'>
        <components.Spinner size='md' color={this.props.isDarkmode ? '#eee' : '#555'} />
      </div>
    )
    if (loadedDomainCount < domainCount) {
      return (
        <div className='mt-8 max-w-sm m-auto text-center'>
          <components.ProgressBar progress={pct} />
          <div className='mt-4 text-gray-400 dark:text-gray-700'>{'Loading domains'}</div>
        </div>
      )
    }
    if (domainCount === 0 || !this.props.domainIds) return this.renderEmpty()
    return this.renderDomains()
  }

  render() {
    return ( 
      <div className='max-w-screen-md m-auto'>
        <components.Modal ref={(ref) => this.connectModal = ref} title={'Connect your wallet'}> 
          <components.ConnectWallet />
        </components.Modal>
        <div className='mt-4 mb-4 text-lg text-center font-bold'>{"My Domains"}</div>
        {this.renderDomainSection()}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  domainIds: services.user.selectors.domainIds(state),
  domainCount: services.user.selectors.domainCount(state),
  loadedDomainCount: services.user.selectors.loadedDomainCount(state),
  reverseLookups: services.names.selectors.reverseLookups(state),
  isDarkmode: services.darkmode.selectors.isDarkmode(state),
})

const mapDispatchToProps = (dispatch) => ({
  loadDomains: () => dispatch(services.user.actions.loadDomains()),
})

export default connect(mapStateToProps, mapDispatchToProps)(MyDomains)
