import React from 'react'
import { connect } from 'react-redux'
import { ArrowRightIcon, ExternalLinkIcon } from '@heroicons/react/solid'
import { Link } from 'react-router-dom'

import components from 'components'
import services from 'services'

class Landing extends React.PureComponent {
  render() {
    return (
      <div className="max-w-2xl m-auto ">
        <div
          className="text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4 text-center"
          data-aos="zoom-y-out"
        >
          {'Fantom Name Service'}
        </div>
        <div
          className="text-center max-w-md m-auto mt-4 mb-8 p-10"
          data-aos="zoom-y-out"
          data-aos-delay="150"
        >
          {
            'A naming service designed to support the Fantom ecosystem and its various subnets.'
          }
        </div>
        <div className="mb-8">
          <components.DomainSearch />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Landing)
