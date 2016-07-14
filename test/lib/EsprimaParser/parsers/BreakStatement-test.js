// spec: https://github.com/estree/estree/blob/master/spec.md#breakstatement
// @TODO: label

describe('BreakStatement tests', () => {
  let breakStatement

  beforeEach(() => {
    breakStatement = createAstNode('BreakStatement')
  })

  it('should return \'BREAK\' signal', () => {
    const result = esprimaParser.BreakStatement(breakStatement)

    expect(result).to.be.equal('BREAK')
  })
})
