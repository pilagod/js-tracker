describe('callEventArg1Checker tests', () => {
  const method = 'method'
  const otherMethod = 'otherMethod'
  const argument = 'argument'
  let callEventArg1Checker

  before(() => {
    callEventArg1Checker = require(`../${libDir}/checkers/helpers/callEventArg1Checker`)
  })

  it('should return status {type: Collection.EVENT} concated statusData when callee.method is in criteria and callee.arguments.length >= 1', () => {
    const data = {
      criteria: {[method]: true},
      callee: new Callee(method),
      statusData: {
        execute: 'execute',
        passive: 'passive'
      }
    }
    data.callee.addArguments([argument])

    const result = callEventArg1Checker(data)

    expect(result).to.be.eql({
      type: Collection.EVENT,
      execute: 'execute',
      passive: 'passive'
    })
  })

  it('should return status with property type and existing property in statusData when callee.method is in criteria and callee.arguments.length >= 1', () => {
    const data = {
      criteria: {[method]: true},
      callee: new Callee(method),
      statusData: {execute: undefined}
    }
    data.callee.addArguments([argument])

    const result = callEventArg1Checker(data)

    expect(result).to.have.property('type')
    expect(result).to.have.property('execute')
    expect(result).to.not.have.property('passive')
  })

  it('should return undefined when callee.method is in criteria but callee.arguments.length < 1', () => {
    const data = {
      criteria: {[method]: true},
      callee: new Callee(method),
    }
    const result = callEventArg1Checker(data)

    expect(result).to.be.undefined
  })

  it('should return undefined when callee.method is not in criteria', () => {
    const data = {
      criteria: {[method]: true},
      callee: new Callee(otherMethod),
    }
    const result = callEventArg1Checker(data)

    expect(result).to.be.undefined
  })
})
