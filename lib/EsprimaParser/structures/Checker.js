const importAllFrom = require('import-all-from')

class Checker {
  constructor(callback, path, options) {
    this.check = callback
    this.checkers = importAllFrom(path, options)
  }

  dispatch(data) {
    if (this.check(data)) {
      return this.getStatus(data)
    }
    return undefined
  }

  getStatus(data) {
    let status

    for (const checker of this.checkers) {
      status = checker(data)

      if (status) {
        break
      }
    }
    return status
  }
}

module.exports = Checker
