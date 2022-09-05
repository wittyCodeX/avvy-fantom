//
// Helpful time functions
// 

const time = {
  sleep: (microseconds) => {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, microseconds)
    })
  },
}

export default time
