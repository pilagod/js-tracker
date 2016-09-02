class Dispatcher {
  constructor(handlers = [], test = () => true) {
    this.test = test
    this.handlers = handlers
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
