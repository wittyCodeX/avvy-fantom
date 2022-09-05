//
// This service renders monetary units
// including fiat & crypto
//

import { ethers } from 'ethers'

const money = {
  renderUSD: (strCents) => {
    if (typeof strCents !== 'string') strCents = strCents.toString()
    let cents
    let dollars
    if (strCents.length > 2) {
      dollars = strCents.substr(0, strCents.length - 2)
      cents = strCents.substr(strCents.length - 2)
    } else {
      dollars = 0
      cents = strCents
    }
    while (cents.length < 2) cents = '0' + cents
    return `$${dollars}.${cents} USD`
  },

  renderWFTM: (amount) => {
    const amt = ethers.utils.formatEther(amount)
    return (+amt).toFixed(4) + ' WFTM'
  },

  renderFTM: (amount) => {
    const amt = ethers.utils.formatEther(amount)
    return (+amt).toFixed(4) + ' FTM'
  },

  // multiplies two strings together
  mul: (str1, str2) => {
    const n1 = ethers.BigNumber.from(str1)
    const n2 = ethers.BigNumber.from(str2)
    return n1.mul(n2).toString()
  },

  // adds two strings together
  add: (str1, str2) => {
    const n1 = ethers.BigNumber.from(str1)
    const n2 = ethers.BigNumber.from(str2)
    return n1.add(n2).toString()
  },
}

export default money
