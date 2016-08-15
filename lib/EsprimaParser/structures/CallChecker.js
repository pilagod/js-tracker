// status type defined
const EVENT = 'EVENT'
const MANIPULATION = 'MANIPULATION'

class CallChecker {
  // expression might be a property string or a Method instance
  /*
  {
    state: 'EVENT' / 'MANIPULATION'
  }
  // use hasOwnProperty to check execute and passive has been set or not
  {
    execute: undefined
    passive: index
  }
  */
  static get EVENT() {
    return EVENT
  }
  static get MANIPULATION() {
    return MANIPULATION
  }
}

module.exports = CallChecker
