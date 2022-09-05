import files from './files'
import localforage from 'localforage'

const storage = localforage

const data = {
  backup: async () => {
    const data = await storage.getItem('persist:root')
    const timestamp = parseInt(Date.now())
    files.download(data, 'application/json', `avvy-backup-${timestamp}.json`)
  },
  
  restore: async () => {
    if (window.confirm("Restoring data will overwrite any existing data. Please back up existing data before proceeding. Would you like to proceed?")) {
      const data = await files.upload()
      await storage.setItem('persist:root', data)
      alert('Data has been restored')
      window.location.reload()
    }
  },

  reset: () => {
    if (window.confirm("Your browser stores your auction bids, as well as your hidden domain names. Please ensure you have backed up your data before continuing.")) { 
      storage.setItem('persist:root', null)
      window.location.reload()
    }
  }
}

export default data
