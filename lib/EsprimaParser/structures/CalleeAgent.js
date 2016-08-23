class CalleeAgent {
  constructor(method) {
    this.callee = method
    this.arguments = []
  }

  setArguments(arrayOfArguments) {
    this.arguments.push(...arrayOfArguments)
  }
}

module.exports = CalleeAgent
