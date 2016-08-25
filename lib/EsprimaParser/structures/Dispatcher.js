const importAllFrom = require('import-all-from')

class Dispatcher {
  constructor(path, options) {
    this.checkers = importAllFrom(path, options)
  }

  dispatch(data) {
    let status

    for(const checker of this.checkers) {
      status = checker.dispatch(data)

      if (status) {
        break
      }
    }
    return status
  }
}

module.exports = Dispatcher
