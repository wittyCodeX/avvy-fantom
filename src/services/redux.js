//
// This file provides helpers for redux operations
//

// for example, if you pass "services/darkmode" as the prefix
// and ["SOME_LABEL"] as the labels, then you'll be returned
// an object as follows:
// {
//   SOME_LABEL: 'fns-web/services/darkmode/SOME_LABEL'
// }
export const prepareConstants = (prefix, labels) => {
  return labels.reduce((labelDict, label) => {
    labelDict[label] = `fns-web/${prefix}/${label}`
    return labelDict
  }, {})
}

const exports = {
  prepareConstants,
}

export default exports
