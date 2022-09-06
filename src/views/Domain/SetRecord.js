import React from 'react'
import { ethers } from 'ethers'
import { useNavigate } from 'react-router-dom'

import components from 'components'
import services from 'services'

class AddRecord extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      initKey: null, // this is used to re-init the select
      recordType: null,
      value: '',
      options: props.api
        ? props.api.avvy.RECORDS._LIST.map((record) => {
            return {
              value: record.key,
              name: record.label,
            }
          })
        : [],
    }
  }

  setValue(value) {
    this.inputRef.value = value
  }

  handleSubmit() {
    let type, value

    if (this.props.deleteRecord) {
      type = this.props.deleteRecord
      value = ''
    } else if (this.props.editRecord) {
      type = this.props.editRecord
      value = this.inputRef.value
    } else {
      type = this.selectRef.getValue()
      value = this.inputRef.value
    }
    this.props.handleSubmit(type, value)
  }

  getEditRecordType() {
    const opts = this.state.options.filter(
      (opt) =>
        opt.value === this.props.editRecord ||
        opt.value === this.props.deleteRecord,
    )
    if (opts.length > 0) return opts[0].name
    return null
  }

  render() {
    return (
      <>
        <div className="max-w-md m-auto">
          <div className="font-bold mb-2">Type</div>
          {this.getEditRecordType() ? (
            <div>{this.getEditRecordType()}</div>
          ) : (
            <components.Select
              key={this.state?.initKey}
              value={this.state?.recordType}
              options={this.state?.options}
              ref={(ref) => (this.selectRef = ref)}
            />
          )}
          <div>
            <div className="font-bold mt-4 mb-2">Value</div>
            <input
              type="text"
              className="bg-gray-100 dark:bg-gray-800 w-full rounded-xl px-4 py-2"
              ref={(ref) => (this.inputRef = ref)}
              disabled={
                this.props.deleteRecord || this.props.loading ? 'disabled' : ''
              }
            />
          </div>
          <div className="mt-8">
            <components.buttons.Button
              sm={true}
              text={'Submit'}
              onClick={this.handleSubmit}
              loading={this.props.loading}
            />
          </div>
        </div>
      </>
    )
  }
}

export default AddRecord
