describe('isCaseMatched tests', () => {
  const discriminant = 'discriminant'

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'parseNode', sandbox.spy(createLiteralStub()))
  })

  it('should call parseNode with testExpression', () => {
    const testExpression = createAstNode('Literal')

    esprimaParser.isCaseMatched(testExpression, discriminant)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(testExpression)
    ).to.be.true
  })

  it('should return true if parsed testExpression equals to discriminant', () => {
    const testExpression = createAstNode('Literal', {value: 'discriminant'})

    const result = esprimaParser.isCaseMatched(testExpression, discriminant)

    expect(result).to.be.true
  })

  it('should return true if test is null (default case)', () => {
    const testExpression = null

    const result = esprimaParser.isCaseMatched(testExpression, discriminant)

    expect(result).to.be.true
  })

  it('should return false if parsed testExpression does not equals to discriminant', () => {
    const testExpression = createAstNode('Literal', {value: 'some other value'})

    const result = esprimaParser.isCaseMatched(testExpression, discriminant)

    expect(result).to.be.false
  })
})
