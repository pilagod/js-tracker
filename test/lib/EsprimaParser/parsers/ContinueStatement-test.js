// spec: https://github.com/estree/estree/blob/master/spec.md#continuestatement
// @TODO: label

describe('ContinueStatement tests', () => {
  let continueStatement

  beforeEach(() => {
    continueStatement = createAstNode('ContinueStatement')
  })

  it('should return \'CONTINUE\' signal', () => {
    const result = esprimaParser.ContinueStatement(continueStatement)

    expect(result).to.be.equal('CONTINUE')
  })
})
