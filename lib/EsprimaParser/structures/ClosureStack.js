const Closure = require('./Closure')

class ClosureStack {
  constructor(context) {
    this.stack = [new Closure(context)]
  }

  get(variable) {
    const closure = this.findClosureByVariable(variable)

    return closure ? closure.get(variable) : undefined
  }

  findClosureByVariable(variable) {
    for (let i = this.stack.length - 1; i >= 0; i -= 1) {
      const closure = this.stack[i]

      if (closure.exist(variable)) {
        return closure
      }
    }
    return undefined
  }

  set(variable, value) {
    const closure = this.getLatestClosure()

    closure.set(variable, value)
  }

  getLatestClosure() {
    return this.stack.slice(-1)[0]
  }

  update(variable, value) {
    let closure = this.findClosureByVariable(variable)

    if (!closure) {
      closure = this.getContextClosure()
    }
    closure.set(variable, value)
  }

  getContextClosure() {
    return this.stack[0]
  }

  createClosure() {
    this.stack.push(new Closure())
  }

  getClone() {
    const newClosureStack = new (this.constructor)()

    newClosureStack.setStack(this.stack)

    return newClosureStack
  }

  setStack(stack) {
    this.stack = [...stack]
  }
}

module.exports = ClosureStack
