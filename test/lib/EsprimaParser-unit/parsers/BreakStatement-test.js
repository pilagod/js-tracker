// spec: https://github.com/estree/estree/blob/master/spec.md#breakstatement

describe('BreakStatement tests', () => {
  let breakStatement

  beforeEach(() => {
    breakStatement = createAstNode('BreakStatement', {
      label: createAstNode('Identifier')
    })
    sandbox.stub(esprimaParser, 'setFlowStateLabel')
    sandbox.stub(esprimaParser, 'flowState', {
      setBreak: sandbox.spy()
    })
  })

  it('should call setFlowStateLabel with label', () => {
    esprimaParser.BreakStatement(breakStatement)

    expect(
      esprimaParser.setFlowStateLabel
        .calledWithExactly(breakStatement.label)
    ).to.be.true
  })

  it('should call flowState.setBreak', () => {
    esprimaParser.BreakStatement(breakStatement)

    expect(esprimaParser.flowState.setBreak.called).to.be.true
  })
})
