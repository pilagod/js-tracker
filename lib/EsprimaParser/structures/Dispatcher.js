const importAllFrom = require('import-all-from')

class Dispatcher {
  constructor({path, options}, test = () => true) {
    this.test = test
    this.handlers = importAllFrom(path, options)
  }

  dispatch(data) {
    return this.test(data) ?
      this.dispatchDataToHandlers(data) : undefined
  }

  dispatchDataToHandlers(data) {
    let status

    for (const handler of this.handlers) {
      status = handler.dispatch(data)

      if (status) {
        break
      }
    }
    return status
  }
}

module.exports = Dispatcher
