//
// Helpful time functions
//
import environment from './environment'
import axios from 'axios'
const nft = {
  generateNFT: async (name, tokenId) => {
    const res = await axios.post(
      `${environment.BACKEND_BASE_URL}/generateNFT`,
      {
        name: name,
        tokenId: tokenId,
      },
    )
    console.log(res)
    return res
  },
}

export default nft
