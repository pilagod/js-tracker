describe('isCaseMatched tests', () => {
  let testExpression, discriminant

  beforeEach(() => {
    testExpression = createAstNode('Expression')
    discriminant = 'discriminant'
  })

  it('should call parseNode with testExpression', () => {
    sandbox.stub(esprimaParser, 'parseNode')

    esprimaParser.isCaseMatched(testExpression, discriminant)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(testExpression)
    ).to.be.true
  })

  it('should return true if parsed testExpression equals to discriminant', () => {
    sandbox.stub(esprimaParser, 'parseNode')
      .withArgs(testExpression).returns(discriminant)

    const result = esprimaParser.isCaseMatched(testExpression, discriminant)

    expect(result).to.be.true
  })

  it('should return false if parsed testExpression does not equals to discriminant', () => {
    sandbox.stub(esprimaParser, 'parseNode')
      .withArgs(testExpression).returns('different')

    const result = esprimaParser.isCaseMatched(testExpression, discriminant)

    expect(result).to.be.false
  })

  it('should return true if test is null (default case)', () => {
    testExpression = null

    const result = esprimaParser.isCaseMatched(testExpression, discriminant)

    expect(result).to.be.true
  })
})
