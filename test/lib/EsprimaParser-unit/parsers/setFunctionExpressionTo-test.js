describe('setFunctionExpressionTo tests', () => {
  const functionAgentData = {}
  const functionAgent = function () {}
  let id
  // stub results
  const variable = 'variable'

  beforeEach(() => {
    id = createAstNode('Identifier')
    functionAgentData.closureStack = {
      createClosure: sandbox.spy(),
      set: sandbox.spy()
    }
    sandbox.stub(esprimaParser, 'getNameFromPattern').returns(variable)
  })

  it('should call getNameFromPattern with id', () => {
    esprimaParser.setFunctionExpressionTo(functionAgentData, id, functionAgent)

    expect(
      esprimaParser.getNameFromPattern
        .calledWithExactly(id)
    ).to.be.true
  })

  it('should call createClosure of functionAgentData.closureStack', () => {
    esprimaParser.setFunctionExpressionTo(functionAgentData, id, functionAgent)

    expect(functionAgentData.closureStack.createClosure.called).to.be.true
  })

  it('should call set of functionAgentData.closureStack with variable and functionAgent after createClosure', () => {
    esprimaParser.setFunctionExpressionTo(functionAgentData, id, functionAgent)

    expect(
      functionAgentData.closureStack.set
        .calledAfter(functionAgentData.closureStack.createClosure)
    ).to.be.true
    expect(
      functionAgentData.closureStack.set
        .calledWithExactly(variable, functionAgent)
    ).to.be.true
  })
})
