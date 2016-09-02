describe('parseCallExpression tests', () => {
  const caller = ['string', ['array']]

  let callExpression, callee

  beforeEach(() => {
    callExpression = createAstNode('CallExpression', {
      callee: createAstNode('Expression'),
      arguments: [createAstNode('Expression')]
    })
    callee = {
      addArguments: sandbox.spy()
    }
    sandbox.stub(esprimaParser, 'parseArguments')
      .returns('resultFromParseArguments')
    sandbox.stub(esprimaParser, 'parseCallee')
      .returns({
        caller: caller,
        callee: callee
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

  it('should call addArguments of callee got from parseCallee with parsedArguments', () => {
    esprimaParser.parseCallExpression(callExpression)

    expect(
      callee.addArguments
        .calledWithExactly('resultFromParseArguments')
    ).to.be.true
  })

  it('should return an array containing destructed caller and callee given valid caller', () => {
    const result = esprimaParser.parseCallExpression(callExpression)

    expect(result).to.be.eql([...caller, callee])
  })

  it('should return an array containing only callee given undefined caller', () => {
    esprimaParser.parseCallee
      .returns({
        caller: undefined,
        callee: callee
      })

    const result = esprimaParser.parseCallExpression(callExpression)

    expect(result).to.be.eql([callee])
  })
})
