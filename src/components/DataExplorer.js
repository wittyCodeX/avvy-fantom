import React from 'react'
import services from 'services'

class DataExplorer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.getFTMVY()

    this.vendors = {
      // block explorers
      avascan: {
        name: 'Avascan',
        logo: services.linking.static('images/vendor/avascan.jpg'),
        class: 'h-12 w-12',
      },
      snowtrace: {
        name: 'Snowtrace',
        logo: services.linking.static('images/vendor/snowtrace.png'),
        class: 'h-12 w-12',
      },
      vscout: {
        name: 'VScout',
        logo: services.linking.static('images/vendor/vscout.svg'),
        class: 'h-12 w-12',
      },

      // dns & ip
      dnslookup: {
        name: 'DNS-Lookup',
        logo: services.linking.static('images/vendor/dns-lookup.png'),
        class: 'h-12 w-12',
      },
      ipinfo: {
        name: 'ipinfo.io',
        logo: services.linking.static('images/vendor/ipinfo-io.png'),
        class: 'h-12 w-12',
      },

      // ipfs
      ipfs: {
        name: 'ipfs.io',
        logo: services.linking.static('images/vendor/ipfs.png'),
        class: 'h-12 w-12',
      },
      cloudflare: {
        name: 'Cloudflare',
        logo: services.linking.static('images/vendor/cloudflare.svg'),
        class: 'h-12 w-12',
      },
    }
  }

  async getFTMVY() {
    const api = await services.provider.buildAPI()
    this.avvy = api.avvy
  }

  renderVendor(key, getLink) {
    const vendor = this.vendors[key]
    const link = getLink(this.props.data.data)
    return (
      <a
        target="_blank"
        href={link}
        className={`cursor-pointer flex flex-col items-center justify-center rounded-xl m-auto bg-gray-100 dark:bg-gray-800 w-full h-32`}
      >
        <div className={`${vendor.class} flex items-center justify-center`}>
          <img src={vendor.logo} alt={vendor.name} className="w-full" />
        </div>
        <div className="mt-2">{vendor.name}</div>
      </a>
    )
  }

  renderXChain() {
    return (
      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
        {this.renderVendor(
          'avascan',
          (d) => `https://avascan.info/blockchain/x/address/${d}`,
        )}
      </div>
    )
  }

  renderPChain() {
    return (
      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
        {this.renderVendor(
          'avascan',
          (d) => `https://avascan.info/blockchain/p/address/${d}`,
        )}
        {this.renderVendor('vscout', (d) => `https://vscout.io/address/${d}`)}
      </div>
    )
  }

  renderEVM() {
    return (
      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
        {this.renderVendor(
          'snowtrace',
          (d) => `https://snowtrace.io/address/${d}`,
        )}
        {this.renderVendor(
          'avascan',
          (d) => `https://avascan.info/blockchain/c/address/${d}`,
        )}
      </div>
    )
  }

  renderValidator() {
    return (
      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
        {this.renderVendor(
          'avascan',
          (d) => `https://avascan.info/staking/validator/${d}`,
        )}
        {this.renderVendor('vscout', (d) => `https://vscout.io/validator/${d}`)}
      </div>
    )
  }

  renderDNS_A() {
    return (
      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
        {this.renderVendor('ipinfo', (d) => `https://ipinfo.io/${d}`)}
      </div>
    )
  }

  renderDNS_CNAME() {
    return (
      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
        {this.renderVendor('dnslookup', (d) => `https://dns-lookup.com/${d}`)}
      </div>
    )
  }

  renderAvatar() {
    return (
      <div>
        <a
          href={this.props.data.data}
          target="_blank"
          className="text-center block"
        >
          <img src={this.props.data.data} className="w-40 m-auto" />
          <div className="mt-4">View image</div>
        </a>
      </div>
    )
  }

  renderContent() {
    const data = this.props.data.data
    const proto = data.split('://')[0]
    const getIPFSHash = (d) => d.split('://')[1]

    if (proto === 'ipfs')
      return (
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
          {this.renderVendor(
            'ipfs',
            (d) => `https://ipfs.io/ipfs/${getIPFSHash(d)}`,
          )}
          {this.renderVendor(
            'cloudflare',
            (d) => `https://cloudflare-ipfs.com/ipfs/${getIPFSHash(d)}`,
          )}
        </div>
      )

    return <div className="text-center py-4">Unknown content protocol</div>
  }

  renderLinks() {
    const records = this.avvy.RECORDS
    switch (this.props.data.dataType) {
      case records.X_CHAIN:
        return this.renderXChain()

      case records.P_CHAIN:
        return this.renderPChain()

      case records.EVM:
        return this.renderEVM()

      case records.VALIDATOR:
        return this.renderValidator()

      case records.DNS_CNAME:
        return this.renderDNS_CNAME()

      case records.DNS_A:
        return this.renderDNS_A()

      case records.AVATAR:
        return this.renderAvatar()

      case records.CONTENT:
        return this.renderContent()
    }
    return null
  }

  getTitle() {
    const records = this.avvy.RECORDS
    let title = {
      [records.X_CHAIN]: 'View on Block Explorer',
      [records.P_CHAIN]: 'View on Block Explorer',
      [records.EVM]: 'View on Block Explorer',
      [records.VALIDATOR]: 'View on Node Explorer',
      [records.DNS_CNAME]: 'DNS Information',
      [records.DNS_A]: 'IP Address Information',
      [records.AVATAR]: 'Preview Avatar',
      [records.CONTENT]: 'Open on IPFS Gateway',
    }[this.props.data.dataType]
    if (!title) title = 'External Link'
    return title
  }

  render() {
    if (!this.props.data) return null
    if (!this.avvy) return null
    const title = this.getTitle()

    return (
      <div>
        <div className="font-bold border-b border-gray-400 pb-4 mb-4">
          {title}
        </div>
        {this.renderLinks()}
      </div>
    )
  }
}

export default DataExplorer
