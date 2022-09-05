import client from 'clients'

const random = {
  salt: () => {
    // this just needs to be somewhat random
    // to prevent frontrunners from guessing
    // and being able to decode bid parameters

    // we'll just pull some browser attributes
    // and mix them with the current time,
    // should be relatively hard to predict.
    const inputs = [
      window.innerHeight,
      window.innerWidth,
      window.navigator.userAgent,
      Date.now().toString(),
    ]
    const input = inputs.join(',')
    const salt = client.utils.keccak256(input)
    return salt
  },
}

export default random
