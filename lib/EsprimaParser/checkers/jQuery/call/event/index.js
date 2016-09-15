const criteria = require('./criteria')
const callEventChecker = require('../../../helpers/callEventChecker')
//
// const filterTarget = ({caller, callee}) => {
//   switch (callee.method) {
//     case 'on':
//     case 'one':
//     case 'off':
//       return filterOn({caller, callee})
//
//     case 'delegate':
//     case 'undelegate':
//       return filterDelegate({caller, callee})
//
//     default:
//       return {}
//   }
// }
//
// const filterOn = ({caller, callee}) => {
//   if (typeof callee.arguments[1] === 'string') {
//     return {
//       target: caller.find(callee.arguments[1])
//     }
//   }
// }
//
// const filterDelegate = ({caller, callee}) => {
//   if (callee.arguments.length > 1) {
//     return {
//       target: caller.find(callee.arguments[0])
//     }
//   }
// }

module.exports = ({caller, callee}) => {
  // const status = callEventChecker({criteria, callee})
  //
  // if (status) {
  //   return Object.assign({}, status, filterTarget({caller, callee}))
  // }
  // return undefined
  return callEventChecker({criteria, callee})
}
