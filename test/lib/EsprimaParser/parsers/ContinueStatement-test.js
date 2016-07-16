// spec: https://github.com/estree/estree/blob/master/spec.md#continuestatement
// @TODO: label

describe('ContinueStatement tests', () => {
  let continueStatement

  beforeEach(() => {
    continueStatement = createAstNode('ContinueStatement')

    sandbox.stub(esprimaParser, 'status', {
      set: sandbox.spy()
    })
  })

  it('should set esprimaParser status to \'continue\'', () => {
    esprimaParser.ContinueStatement(continueStatement)

    expect(
      esprimaParser.status.set
        .calledWithExactly('continue')
    ).to.be.true
  })

  it('should return undefined', () => {
    const result = esprimaParser.ContinueStatement(continueStatement)

    expect(result).to.be.undefined
  })
})
