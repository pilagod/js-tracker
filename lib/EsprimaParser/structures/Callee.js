class Callee {
  constructor(method) {
    this.method = method
    this.arguments = []
  }

  setArguments(arrayOfArguments) {
    this.arguments.push(...arrayOfArguments)
  }
}

module.exports = Callee
