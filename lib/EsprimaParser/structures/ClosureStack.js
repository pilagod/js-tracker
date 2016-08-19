const Closure = require('./Closure')

class ClosureStack {
  constructor(context) {
    this.context = context
    this.stack = [new Closure(context)]
  }

  getContext() {
    return this.context
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
    const closure = this.findClosureByVariable(variable)

    if (closure) {
      closure.set(variable, value)
    }
  }

  createClosure() {
    this.stack.push(new Closure())
  }

  getStack() {
    const newClosureStack = new (this.constructor)()

    newClosureStack.setContext(this.context)
    newClosureStack.setStack(this.stack)

    return newClosureStack
  }

  setContext(context) {
    this.context = context
  }

  setStack(stack) {
    this.stack = [...stack]
  }
}

module.exports = ClosureStack
