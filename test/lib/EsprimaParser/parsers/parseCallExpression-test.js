describe('parseCallExpression tests', () => {
  let callExpression

  beforeEach(() => {
    callExpression = createAstNode('CallExpression', {
      callee: 'callee',
      arguments: 'arguments'
    })

    sandbox.stub(esprimaParser, 'parseArguments', sandbox.spy(() => {
      return ['parsedArguments']
    }))
  })

  const setGetCalleeAndCalledMethodReturnValue = (
    callee = ['callee'],
    calledMethod = {
      method: 'method',
      arguments: ['parsedArguments']
    }
  ) => {
    sandbox.stub(esprimaParser, 'getCalleeAndCalledMethod', sandbox.spy(() => {
      return {callee, calledMethod}
    }))
  }

  it('should call parseArguments with call arguments', () => {
    setGetCalleeAndCalledMethodReturnValue()

    esprimaParser.parseCallExpression(callExpression)

    expect(
      esprimaParser.parseArguments
        .calledWithExactly('arguments')
    ).to.be.true
  })

  it('should call getCalleeAndCalledMethod with call callee and result from parseArguments', () => {
    setGetCalleeAndCalledMethodReturnValue()

    esprimaParser.parseCallExpression(callExpression)

    expect(
      esprimaParser.getCalleeAndCalledMethod
        .calledWithExactly('callee', ['parsedArguments'])
    ).to.be.true
  })

  it('should return [callee, calledMethod] given valid callee', () => {
    setGetCalleeAndCalledMethodReturnValue()

    const result = esprimaParser.parseCallExpression(callExpression)

    expect(result).to.be.eql(['callee', {
      method: 'method',
      arguments: ['parsedArguments']
    }])
  })

  it('should return [calledMethod] given null callee', () => {
    setGetCalleeAndCalledMethodReturnValue(null)

    const result = esprimaParser.parseCallExpression(callExpression)

    expect(result).to.be.eql([{
      method: 'method',
      arguments: ['parsedArguments']
    }])
  })
})
