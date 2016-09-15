describe('callEventArgge1Checker tests', () => {
  const method = 'method'
  const otherMethod = 'otherMethod'
  const argument = 'argument'
  let callEventArgge1Checker

  before(() => {
    callEventArgge1Checker = require(`../${libDir}/checkers/helpers/callEventArgge1Checker`)
  })

  it('should return valid status given callee.method is in criteria and callee.arguments.length >= 1', () => {
    const data = {
      criteria: {[method]: true},
      callee: new Callee(method),
    }
    data.callee.addArguments([argument])

    const result = callEventArgge1Checker(data)

    expect(result).to.be.eql({type: Collection.EVENT})
  })

  it('should return undefined when callee.method is in criteria but callee.arguments.length < 1', () => {
    const data = {
      criteria: {[method]: true},
      callee: new Callee(method),
    }
    const result = callEventArgge1Checker(data)

    expect(result).to.be.undefined
  })

  it('should return status type EVENT when all criteria matched', () => {
    const data = {
      criteria: {[method]: true},
      callee: new Callee(method),
    }
    data.callee.addArguments([argument])

    const result = callEventArgge1Checker(data)

    expect(result).to.be.have.property('type', Collection.EVENT)
  })

  it('should return undefined when callee.method is not in criteria', () => {
    const data = {
      criteria: {[method]: true},
      callee: new Callee(otherMethod),
    }
    const result = callEventArgge1Checker(data)

    expect(result).to.be.undefined
  })
})
