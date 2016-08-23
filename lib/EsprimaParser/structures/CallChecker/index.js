const EVENT = 'EVENT'
const MANIPULATION = 'MANIPULATION'

const importAllFrom = require('import-all-from')

class CallChecker {
  constructor(context) {
    this.context = context
    this.checkers = importAllFrom(__dirname + '/Checkers')
  }
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
