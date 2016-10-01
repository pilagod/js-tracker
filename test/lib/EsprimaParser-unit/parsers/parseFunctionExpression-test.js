describe('parseFunctionExpression tests', () => {
  const functionEnvironment = {
    scriptUrl: 'scriptUrl',
    closureStack: {}
  }
  const functionInfo = {
    body: 'BlockStatement',
    params: ['params']
  }
  let functionExpression

  beforeEach(() => {
    functionExpression = createAstNode('FunctionExpression', {
      body: createAstNode('BlockStatement')
    })
    sandbox.stub(esprimaParser, 'getEnvironment').returns(functionEnvironment)
    sandbox.stub(esprimaParser, 'parseFunctionInfo').returns(functionInfo)
  })

  it('should call getEnvironment with esprimaParser', () => {
    esprimaParser.parseFunctionExpression(functionExpression)

    expect(
      esprimaParser.getEnvironment
        .calledWithExactly(esprimaParser)
    ).to.be.true
  })

  it('should call parseFunctionInfo with functionExpression', () => {
    esprimaParser.parseFunctionExpression(functionExpression)

    expect(
      esprimaParser.parseFunctionInfo
        .calledWithExactly(functionExpression)
    ).to.be.true
  })

  it('should return an object concating functionEnvironment and functionInfo', () => {
    const result = esprimaParser.parseFunctionExpression(functionExpression)

    expect(result).to.be.eql(Object.assign({}, functionEnvironment, functionInfo))
  })
})
