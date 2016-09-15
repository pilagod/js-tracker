describe('callManiArg0Checker tests', () => {
  const method = 'method'
  const otherMethod = 'otherMethod'
  const argument = 'argument'
  let callManiArg0Checker

  before(() => {
    callManiArg0Checker = require(`../${libDir}/checkers/helpers/callManiArg0Checker`)
  })

  it('should return valid status given callee.method is in criteria and callee.arguments.length === 0', () => {
    const data = {
      criteria: {[method]: true},
      callee: new Callee(method),
    }
    const result = callManiArg0Checker(data)

    expect(result).to.be.eql({type: Collection.MANIPULATION})
  })

  it('should return undefined when callee.method is in criteria but callee.arguments.length > 0', () => {
    const data = {
      criteria: {[method]: true},
      callee: new Callee(method),
    }
    data.callee.addArguments([argument])

    const result = callManiArg0Checker(data)

    expect(result).to.be.undefined
  })

  it('should return status type MANIPULATION when all criteria matched', () => {
    const data = {
      criteria: {[method]: true},
      callee: new Callee(method),
    }
    const result = callManiArg0Checker(data)

    expect(result).to.have.property('type', Collection.MANIPULATION)
  })

  it('should return undefined when callee.method is not in criteria', () => {
    const data = {
      criteria: {[method]: true},
      callee: new Callee(otherMethod),
    }
    const result = callManiArg0Checker(data)

    expect(result).to.be.undefined
  })
})
