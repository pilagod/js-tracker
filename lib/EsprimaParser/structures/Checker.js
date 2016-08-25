const importAllFrom = require('import-all-from')

class Checker {
  constructor(callback, path, options) {
    this.check = callback
    this.checkers = importAllFrom(path, options)
  }

  dispatch(data) {
    let status

    if (this.check(data)) {
      status = this.getStatus(data)
    }
    return status
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
