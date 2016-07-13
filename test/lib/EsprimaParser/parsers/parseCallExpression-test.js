describe('parseCallExpression tests', () => {
  let callExpression

  const setParseCalleeAndMethodReturnValue = (
    callee = ['callee'],
    method = {
      method: 'method',
      arguments: ['parsedArguments']
    }
  ) => {
    if (esprimaParser.parseCalleeAndMethod.restore) {
      esprimaParser.parseCalleeAndMethod.restore()
    }
    sandbox.stub(esprimaParser, 'parseCalleeAndMethod', sandbox.spy(() => {
      return {callee, method}
    }))
  }

  beforeEach(() => {
    callExpression = createAstNode('CallExpression', {
      callee: 'callee',
      arguments: 'arguments'
    })

    sandbox.stub(esprimaParser, 'parseArguments', sandbox.spy(() => {
      return ['parsedArguments']
    }))
    setParseCalleeAndMethodReturnValue()
  })

  it('should call parseArguments with call arguments', () => {
    esprimaParser.parseCallExpression(callExpression)

    expect(
      esprimaParser.parseArguments
        .calledWithExactly('arguments')
    ).to.be.true
  })

  it('should call getCalleeAndCalledMethod with call callee and result from parseArguments', () => {
    esprimaParser.parseCallExpression(callExpression)

    expect(
      esprimaParser.parseCalleeAndMethod
        .calledWithExactly('callee', ['parsedArguments'])
    ).to.be.true
  })

  it('should return [callee, calledMethod] given valid callee', () => {
    const result = esprimaParser.parseCallExpression(callExpression)

    expect(result).to.be.instanceof(Array)
    expect(result).to.be.eql(['callee', {
      method: 'method',
      arguments: ['parsedArguments']
    }])
  })

  it('should return [[...], calledMethod] given array callee', () => {
    setParseCalleeAndMethodReturnValue([[1, 2, 3]])

    const result = esprimaParser.parseCallExpression(callExpression)

    expect(result).to.be.instanceof(Array)
    expect(result).to.be.eql([[1, 2, 3], {
      method: 'method',
      arguments: ['parsedArguments']
    }])
  })

  it('should return [object1, object2, ..., calledMethod] given member callee', () => {
    setParseCalleeAndMethodReturnValue(['object1', 'object2'])

    const result = esprimaParser.parseCallExpression(callExpression)

    expect(result).to.be.instanceof(Array)
    expect(result).to.be.eql(['object1', 'object2', {
      method: 'method',
      arguments: ['parsedArguments']
    }])
  })

  it('should return [calledMethod] given null callee', () => {
    setParseCalleeAndMethodReturnValue(null)

    const result = esprimaParser.parseCallExpression(callExpression)

    expect(result).to.be.instanceof(Array)
    expect(result).to.be.eql([{
      method: 'method',
      arguments: ['parsedArguments']
    }])
  })
})
