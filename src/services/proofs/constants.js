import reduxService from 'services/redux'

const constants = reduxService.prepareConstants(
  'services/proofs',
  [
    'SET_PRICING_PROOF',
    'SET_CONSTRAINTS_PROOF',
  ]
)

export default constants
