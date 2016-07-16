// spec: https://github.com/estree/estree/blob/master/spec.md#thisexpression

describe('ThisExpression tests', () => {
  let thisExpression

  beforeEach(() => {
    thisExpression = createAstNode('ThisExpression')

    sandbox.stub(esprimaParser, 'closureStack', {
      get: sandbox.stub()
        .returns('resultFromClosureStackGet')
    })
  })

  it('should call get of closureStack with \'this\' and return', () => {
    const result = esprimaParser.ThisExpression(thisExpression)

    expect(
      esprimaParser.closureStack.get
        .calledWithExactly('this')
    ).to.be.true
    expect(result).to.be.equal('resultFromClosureStackGet')
  })
})
