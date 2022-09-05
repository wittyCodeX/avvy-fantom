const device = {
  isMobile: () => {
    return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
  },
  isAndroid: () => {
    return (/Android/i.test(navigator.userAgent))
  },
}

export default device
