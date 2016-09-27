// spec: https://github.com/estree/estree/blob/master/spec.md#functions

describe('FunctionExpression tests', () => {
  const functionAgent = function () {}
  let functionExpression

  beforeEach(() => {
    functionExpression = createAstNode('FunctionExpression')

    sandbox.stub(esprimaParser, 'createFunctionAgent')
      .returns(functionAgent)
  })

  it('should call createFunctionAgent with functionExpression and return', () => {
    const result = esprimaParser.FunctionExpression(functionExpression)

    expect(result).to.be.equal(functionAgent)
  })
})
