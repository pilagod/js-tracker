// spec: https://github.com/estree/estree/blob/master/spec.md#breakstatement
// @TODO: label
describe('BreakStatement tests', () => {
  let breakStatement

  beforeEach(() => {
    breakStatement = createAstNode('BreakStatement')

    sandbox.stub(esprimaParser, 'flowState', {
      set: sandbox.spy()
    })
  })

  it('should set flowState to \'break\'', () => {
    esprimaParser.BreakStatement(breakStatement)

    expect(
      esprimaParser.flowState.set
        .calledWithExactly('break')
    ).to.be.true
  })

  it('should return undefined', () => {
    const result = esprimaParser.BreakStatement(breakStatement)

    expect(result).to.be.undefined
  })
})
