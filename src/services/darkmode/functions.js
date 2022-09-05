
const functions = {
  setDOMDarkmode: (value) => {
    const rootElem = document.documentElement
    if (value) {
      rootElem.classList.add('dark')
    } else {
      rootElem.classList.remove('dark')
    }
  },
}

export default functions
