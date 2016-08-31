class Callee {
  constructor(method) {
    this.method = method
    this.arguments = []
  }

  addArguments(arrayOfArguments) {
    this.arguments.push(...arrayOfArguments)
  }
}

module.exports = Callee
