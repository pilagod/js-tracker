// spec: https://github.com/estree/estree/blob/master/spec.md#functionexpression

describe('FunctionDeclaration tests', () => {
  const variable = 'variable'
  const functionAgent = function () {}
  let functionDeclaration

  beforeEach(() => {
    functionDeclaration = createAstNode('FunctionDeclaration', {
      id: createAstNode('Identifier'),
      params: [createAstNode('Pattern')],
      body: createAstNode('BlockStatement')
    })
    sandbox.stub(esprimaParser, 'getNameFromPattern').returns(variable)
    sandbox.stub(esprimaParser, 'createFunctionAgent').returns(functionAgent)
    sandbox.stub(esprimaParser, 'setVariables')
  })

  it('should call getNameFromPattern with functionDeclaration id', () => {
    esprimaParser.FunctionDeclaration(functionDeclaration)

    expect(
      esprimaParser.getNameFromPattern
        .calledWithExactly(functionDeclaration.id)
    ).to.be.true
  })

  it('should call createFunctionAgent with functionDeclaration', () => {
    esprimaParser.FunctionDeclaration(functionDeclaration)

    expect(
      esprimaParser.createFunctionAgent
        .calledWithExactly(functionDeclaration)
    ).to.be.true
  })

  it('should call setVariables with variable and functionAgent', () => {
    esprimaParser.FunctionDeclaration(functionDeclaration)

    expect(
      esprimaParser.setVariables
        .calledWithExactly(variable, functionAgent)
    ).to.be.true
  })
})
