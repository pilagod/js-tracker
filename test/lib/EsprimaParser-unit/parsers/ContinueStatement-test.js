// spec: https://github.com/estree/estree/blob/master/spec.md#continuestatement

describe('ContinueStatement tests', () => {
  let continueStatement

  beforeEach(() => {
    continueStatement = createAstNode('ContinueStatement', {
      label: createAstNode('Identifier')
    })
    sandbox.stub(esprimaParser, 'setFlowStateLabel')
    sandbox.stub(esprimaParser, 'flowState', {
      setContinue: sandbox.spy()
    })
  })

  it('should call setFlowStateLabel with label', () => {
    esprimaParser.ContinueStatement(continueStatement)

    expect(
      esprimaParser.setFlowStateLabel
        .calledWithExactly(continueStatement.label)
    ).to.be.true
  })

  it('should call flowState.setContinue', () => {
    esprimaParser.ContinueStatement(continueStatement)

    expect(esprimaParser.flowState.setContinue.called).to.be.true
  })
})
