import React from 'react'
import { connect } from 'react-redux'
import { ethers } from 'ethers'
import { useNavigate } from 'react-router-dom'

import actions from './actions'
import selectors from './selectors'

import components from 'components'
import services from 'services'

class SetResolver extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      type: null,
      customAddress: null,
      datasetId: null,
      resolverOptions: [],
    }
    this.nullAddress = '0x0000000000000000000000000000000000000000'
  }

  componentDidMount() {
    this.setResolverOptions()
  }

  setResolverOptions = async () => {
    const api = await services.provider.buildAPI()
    const defaultResolverAddress = api.getDefaultResolverAddress()
    this.setState({
      resolverOptions: [
        { name: 'Default Resolver', value: defaultResolverAddress },
        //{ name: 'Custom Resolver', value: 'CUSTOM' },
      ],
    })
  }

  submit = async () => {
    let address = this.state.type
    if (address === 'NONE') address = this.nullAddress
    this.props.setResolver(this.props.domain, address)
  }

  render() {
    if (this.props.complete)
      return (
        <>
          <div className="max-w-md m-auto">
            <components.labels.Success text={'Resolver has been updated'} />
          </div>
          <div className="max-w-md m-auto mt-4">
            <components.buttons.Button
              text={'Close'}
              onClick={() => this.props.onComplete()}
            />
          </div>
        </>
      )

    const initial = this.props.resolver ? this.props.resolver.resolver : 'NONE'

    return (
      <>
        <div className="max-w-md m-auto">
          <div className="font-bold mb-2 mt-4">Type</div>
          <components.Select
            initial={initial}
            options={this.state.resolverOptions}
            ref={(ref) => {
              if (ref) {
                ref.addEventListener('change', (e) => {
                  if (ref) {
                    this.setState({
                      type: ref.getValue(),
                    })
                  }
                })
              }
            }}
          />
          {this.state.type === 'CUSTOM' ? (
            <div>
              <div className="font-bold mt-4 mb-2">Address</div>
              <input
                type="text"
                value={this.state.customAddress}
                className="bg-gray-100 dark:bg-gray-800 w-full rounded-xl px-4 py-2"
                onChangeText={(text) => this.setState({ customAddress: text })}
              />
            </div>
          ) : null}
          <div className="mt-8">
            <components.buttons.Button
              sm={true}
              text={'Submit'}
              onClick={() => this.submit()}
              loading={this.props.loading}
            />
          </div>
        </div>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  loading: selectors.setResolverLoading(state),
  complete: selectors.setResolverComplete(state),
  resolver: selectors.resolver(state),
})

const mapDispatchToProps = (dispatch) => ({
  setResolver: (domain, address) =>
    dispatch(actions.setResolver(domain, address)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SetResolver)
