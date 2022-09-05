import { reducerName } from './reducer'

const root = (state) => state[reducerName]

const selectors = {
  progress: (state) => root(state).progress,
  commitHash: (state) => root(state).commitHash,
  commitSalt: (state) => root(state).commitSalt,
  hasCommit: (state) => root(state).hasCommit,
  hasError: (state) => root(state).hasError,
  isComplete: (state) => root(state).isComplete,
  isCommitting: (state) => root(state).isCommitting,
  isFinalizing: (state) => root(state).isFinalizing,
  enhancedPrivacy: (state) => root(state).enableEnhancedPrivacy,
  registrationPremium: (state) => root(state).registrationPremium,
  balance: (state) => root(state).balance,
}

export default selectors
