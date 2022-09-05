// provides file-related functionality
const files = {
  download: (data, mimeType, filename) => {
    const element = document.createElement("a");
    const file = new Blob([data], {type: mimeType});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element)
  },

  upload: () => {
    return new Promise((resolve, reject) => {
      const element = document.createElement('input')
      element.type = 'file'
      element.addEventListener('change', (e) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const data = e.target.result
          return resolve(data)
        }
        reader.readAsText(element.files[0])
      })
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    })
  }
}

export default files
