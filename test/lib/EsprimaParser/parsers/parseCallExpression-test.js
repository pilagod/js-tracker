describe('parseCallExpression tests', () => {
  let callExpression, calledArguments

  const setParseCalleeAndMethodReturnCallee = (callee) => {
    if (esprimaParser.parseCalleeAndMethod.restore) {
      esprimaParser.parseCalleeAndMethod.restore()
    }
    sandbox.stub(esprimaParser, 'parseCalleeAndMethod')
      .returns({
        callee: callee,
        method: {
          method: 'method',
          arguments: calledArguments
        }
      })
  }

  beforeEach(() => {
    callExpression = createAstNode('CallExpression', {
      callee: createAstNode('Expression'),
      arguments: [createAstNode('Expression')]
    })
    calledArguments = ['parsedExpression']

    sandbox.stub(esprimaParser, 'parseArguments')
      .returns(calledArguments)
    setParseCalleeAndMethodReturnCallee(['callee'])
  })

  it('should call parseArguments with call arguments', () => {
    esprimaParser.parseCallExpression(callExpression)

    expect(
      esprimaParser.parseArguments
        .calledWithExactly(callExpression.arguments)
    ).to.be.true
  })

  it('should call getCalleeAndCalledMethod with call callee and result from parseArguments', () => {
    esprimaParser.parseCallExpression(callExpression)

    expect(
      esprimaParser.parseCalleeAndMethod
        .calledWithExactly(callExpression.callee, calledArguments)
    ).to.be.true
  })

  it('should return [callee, calledMethod] given valid callee', () => {
    const result = esprimaParser.parseCallExpression(callExpression)

    expect(result).to.be.instanceof(Array)
    expect(result).to.be.eql(['callee', {
      method: 'method',
      arguments: calledArguments
    }])
  })

  it('should return [[...], calledMethod] given array callee', () => {
    setParseCalleeAndMethodReturnCallee([[1, 2, 3]])

    const result = esprimaParser.parseCallExpression(callExpression)

    expect(result).to.be.instanceof(Array)
    expect(result).to.be.eql([[1, 2, 3], {
      method: 'method',
      arguments: calledArguments
    }])
  })

  it('should return [object1, object2, ..., calledMethod] given member callee', () => {
    setParseCalleeAndMethodReturnCallee(['object1', 'object2'])

    const result = esprimaParser.parseCallExpression(callExpression)

    expect(result).to.be.instanceof(Array)
    expect(result).to.be.eql(['object1', 'object2', {
      method: 'method',
      arguments: calledArguments
    }])
  })

  it('should return [calledMethod] given null callee', () => {
    setParseCalleeAndMethodReturnCallee(null)

    const result = esprimaParser.parseCallExpression(callExpression)

    expect(result).to.be.instanceof(Array)
    expect(result).to.be.eql([{
      method: 'method',
      arguments: calledArguments
    }])
  })
})
