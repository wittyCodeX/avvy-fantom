import React from 'react'
import { connect } from 'react-redux'
import { DownloadIcon, UploadIcon, TrashIcon } from '@heroicons/react/outline'

import components from 'components'
import services from 'services'


class Settings extends React.PureComponent {
  render() {
    return (
      <div className='max-w-md m-auto'>
        <div className='mb-8 font-bold text-center mt-4 text-lg'>{'Settings'}</div>
        <div className='dark:border-gray-700 rounded border-gray-100 border-2 p-4'>
          <div>
            <div className='font-bold'>{'Browser Data Storage'}</div>
            <div className='mb-4 text-gray-700 dark:text-gray-200 text-sm'>{'Your browser stores important non-public information, such as revealed names of your Enhanced Privacy domains.'}</div>
          </div>
          <div onClick={() => services.data.backup()} className="flex cursor-pointer justify-between bg-gray-100 dark:bg-gray-700 font-bold p-4 rounded mb-2">
            <div>{'Backup Data'}</div>
            <DownloadIcon className="h-6" />
          </div>
          <div onClick={() => services.data.restore()} className="flex cursor-pointer justify-between bg-gray-100 dark:bg-gray-700 font-bold p-4 rounded mb-2">
            <div>{'Restore Data'}</div>
            <UploadIcon className="h-6" />
          </div>
          <div onClick={() => services.data.reset()} className="flex cursor-pointer justify-between bg-gray-100 dark:bg-gray-700 font-bold p-4 rounded mb-2">
            <div>{'Reset Data'}</div>
            <TrashIcon className="h-6" />
          </div>
        </div>
        <div className='rounded border-gray-100 dark:border-gray-700 border-2 p-4 mt-4'>
          <div>
            <div className='font-bold'>{'Error Tracking'}</div>
            <div className='mb-4 text-gray-700 text-sm dark:text-gray-200'>{'If you enable Error Tracking, we use Sentry.io to capture error logs from your browser. This helps our developers to isolate and resolve bugs in the application.'}</div>
          </div>
          <components.checkbox.Button text={'Enable Error Tracking'} onCheck={() => {
            this.props.setInjectSentry(!this.props.injectSentry)
            window.location.reload()
          }} checked={this.props.injectSentry} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  injectSentry: services.analytics.selectors.injectSentry(state),
})

const mapDispatchToProps = (dispatch) => ({
  setInjectSentry: (val) => dispatch(services.analytics.actions.injectSentry(val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
