describe('callManiArg2ObjectChecker tests', () => {
  const method = 'method'
  const otherMethod = 'otherMethod'
  const argument = 'argument'
  let callManiArg2ObjectChecker

  before(() => {
    callManiArg2ObjectChecker = require(`../${libDir}/checkers/helpers/callManiArg2ObjectChecker`)
  })

  it('should return valid status given callee.method is in criteria and callee.arguments.length >= 2', () => {
    const data = {
      criteria: {[method]: true},
      callee: new Callee(method),
    }
    data.callee.addArguments(new Array(2).fill(argument))

    const result = callManiArg2ObjectChecker(data)

    expect(result).to.be.eql({type: Collection.MANIPULATION})
  })

  it('should return valid status given callee.method is in criteria and callee.arguments[0] is plain Object', () => {
    const data = {
      criteria: {[method]: true},
      callee: new Callee(method),
    }
    data.callee.addArguments([{}])

    const result = callManiArg2ObjectChecker(data)

    expect(result).to.be.eql({type: Collection.MANIPULATION})
  })

  it('should return undefined given callee.method is in criteria but callee.arguments.length < 2', () => {
    const data = {
      criteria: {[method]: true},
      callee: new Callee(method),
    }
    data.callee.addArguments([argument])

    const result = callManiArg2ObjectChecker(data)

    expect(result).to.be.undefined
  })

  it('should return undefined given callee.method is in criteria but callee.arguments[0] is not plain Object', () => {
    const data = {
      criteria: {[method]: true},
      callee: new Callee(method),
    }
    data.callee.addArguments([new (function () {})])

    const result = callManiArg2ObjectChecker(data)

    expect(result).to.be.undefined
  })

  it('should return status type MANIPULATION concated statusData when all criteria matched', () => {
    const data = {
      criteria: {[method]: true},
      callee: new Callee(method),
      statusData: {
        execute: 'execute',
        passive: 'passive'
      }
    }
    data.callee.addArguments([{}])

    const result = callManiArg2ObjectChecker(data)

    expect(result).to.be.eql({
      type: Collection.MANIPULATION,
      execute: 'execute',
      passive: 'passive'
    })
  })

  it('should return status only with type and properties in statusData when all criteria matched', () => {
    const data = {
      criteria: {[method]: true},
      callee: new Callee(method),
      statusData: {execute: undefined}
    }
    data.callee.addArguments([{}])

    const result = callManiArg2ObjectChecker(data)

    expect(result).to.have.property('type')
    expect(result).to.have.property('execute')
    expect(result).to.not.have.property('passive')
  })

  it('should return undefined when callee.method is not in criteria', () => {
    const data = {
      criteria: {[method]: true},
      callee: new Callee(otherMethod),
    }
    data.callee.addArguments([{}])

    const result = callManiArg2ObjectChecker(data)

    expect(result).to.be.undefined
  })
})
