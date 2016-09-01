describe('callManiArg0Checker tests', () => {
  const method = 'method'
  const otherMethod = 'otherMethod'
  const argument = 'argument'
  let callManiArg0Checker

  before(() => {
    callManiArg0Checker = require(`../${libDir}/checkers/helpers/callManiArg0Checker`)
  })

  it('should return status type MANIPULATION concated statusData when callee.method is in criteria and callee.arguments.length === 0', () => {
    const data = {
      criteria: {[method]: true},
      callee: new Callee(method),
      statusData: {
        execute: 'execute',
        passive: 'passive'
      }
    }
    const result = callManiArg0Checker(data)

    expect(result).to.be.eql({
      type: Collection.EVENT,
      execute: 'execute',
      passive: 'passive'
    })
  })

  it('should return status only with type and properties in statusData when callee.method is in criteria and callee.arguments.length === 0', () => {
    const data = {
      criteria: {[method]: true},
      callee: new Callee(method),
      statusData: {execute: undefined}
    }
    const result = callManiArg0Checker(data)

    expect(result).to.have.property('type')
    expect(result).to.have.property('execute')
    expect(result).to.not.have.property('passive')
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

  it('should return undefined when callee.method is not in criteria', () => {
    const data = {
      criteria: {[method]: true},
      callee: new Callee(otherMethod),
    }
    const result = callManiArg0Checker(data)

    expect(result).to.be.undefined
  })
})
