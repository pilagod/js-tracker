describe('parseCallExpression tests', () => {
  const callee = ['string', ['array']]
  let callExpression, method

  beforeEach(() => {
    callExpression = createAstNode('CallExpression', {
      callee: createAstNode('Expression'),
      arguments: [createAstNode('Expression')]
    })

    method = {
      setArguments: sandbox.spy()
    }

    sandbox.stub(esprimaParser, 'parseArguments')
      .returns('resultFromParseArguments')
    sandbox.stub(esprimaParser, 'parseCallee')
      .returns({
        callee: callee,
        method: method
      })
  })

  it('should call parseArguments with call arguments', () => {
    esprimaParser.parseCallExpression(callExpression)

    expect(
      esprimaParser.parseArguments
        .calledWithExactly(callExpression.arguments)
    ).to.be.true
  })

  it('should call parseCallee with callee', () => {
    esprimaParser.parseCallExpression(callExpression)

    expect(
      esprimaParser.parseCallee
        .calledWithExactly(callExpression.callee)
    ).to.be.true
  })

  it('should call setArguments of method got from parseCallee with parsedArguments', () => {
    esprimaParser.parseCallExpression(callExpression)

    expect(
      method.setArguments
        .calledWithExactly('resultFromParseArguments')
    ).to.be.true
  })

  it('should return an array containing destructed callee and method given valid callee', () => {
    const result = esprimaParser.parseCallExpression(callExpression)

    expect(result).to.be.eql([...callee, method])
  })

  it('should return an array containing only method given undefined callee', () => {
    esprimaParser.parseCallee
      .returns({
        callee: undefined,
        method: method
      })

    const result = esprimaParser.parseCallExpression(callExpression)

    expect(result).to.be.eql([method])
  })
})
