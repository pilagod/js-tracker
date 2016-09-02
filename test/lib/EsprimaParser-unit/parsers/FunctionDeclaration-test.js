// spec: https://github.com/estree/estree/blob/master/spec.md#functionexpression

describe('FunctionDeclaration tests', () => {
  let functionDeclaration

  beforeEach(() => {
    functionDeclaration = createAstNode('FunctionDeclaration', {
      id: createAstNode('Identifier'),
      params: [createAstNode('Pattern')],
      body: createAstNode('BlockStatement')
    })

    sandbox.stub(esprimaParser, 'getNameFromPattern')
      .returns('resultFromGetNameFromPattern')
    sandbox.stub(esprimaParser, 'FunctionExpression')
      .returns('resultFromFunctionExpression')
    sandbox.stub(esprimaParser, 'setVariables')
  })

  it('should call getNameFromPattern with functionDeclaration id', () => {
    esprimaParser.FunctionDeclaration(functionDeclaration)

    expect(
      esprimaParser.getNameFromPattern
        .calledWithExactly(functionDeclaration.id)
    ).to.be.true
  })

  it('should call FunctionExpression with functionDeclaration', () => {
    esprimaParser.FunctionDeclaration(functionDeclaration)

    expect(
      esprimaParser.FunctionExpression
        .calledWithExactly(functionDeclaration)
    ).to.be.true
  })

  it('should call setVariables with result from getNameFromPattern and FunctionExpression', () => {
    esprimaParser.FunctionDeclaration(functionDeclaration)

    expect(
      esprimaParser.setVariables
        .calledWithExactly(
          'resultFromGetNameFromPattern',
          'resultFromFunctionExpression'
        )
    ).to.be.true
  })
})
