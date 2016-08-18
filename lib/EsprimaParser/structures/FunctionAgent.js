class FunctionAgent {
  constructor(init) {
    this.body = init.body
    this.params = init.params
    this.scriptUrl = init.scriptUrl
    this.closureStack = init.closureStack
  }
}

module.exports = FunctionAgent
