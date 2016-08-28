const importAllFrom = require('import-all-from')

class Dispatcher {
  constructor({path, options}, test = () => true) {
    this.test = test
    this.handlers = importAllFrom(path, options)
  }

  dispatch(data) {
    return this.test(data) ? this.dispatchToHandlers(data) : undefined
  }

  dispatchToHandlers(data) {
    let status

    for (const handler of this.handlers) {
      if ((status = this.invoke(handler, data))) {
        break
      }
    }
    return status
  }

  invoke(handler, data) {
    return handler.dispatch ? handler.dispatch(data) : handler(data)
  }
}

module.exports = Dispatcher
