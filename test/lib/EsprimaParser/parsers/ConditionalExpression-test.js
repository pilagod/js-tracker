// spec: https://github.com/estree/estree/blob/master/spec.md#conditionalexpression

describe('ConditionalExpression tests', () => {
  let conditionalExpression

  beforeEach(() => {
    conditionalExpression = createAstNode('ConditionalExpression', {
      alternate: createAstNode('Literal', {value: 'test fails'}),
      consequent: createAstNode('Literal', {value: 'test passes'})
    })

    sandbox.stub(esprimaParser, 'parseNode', sandbox.spy(createLiteralStub()))
  })

  it('should return parsed consequent given test true', () => {
    conditionalExpression.test = createAstNode('Literal', {value: true})

    const result = esprimaParser.ConditionalExpression(conditionalExpression)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(conditionalExpression.consequent)
    ).to.be.true
    expect(result).to.be.eql('test passes')
  })

  it('should return parsed alternate given test false', () => {
    conditionalExpression.test = createAstNode('Literal', {value: false})

    const result = esprimaParser.ConditionalExpression(conditionalExpression)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(conditionalExpression.alternate)
    ).to.be.true
    expect(result).to.be.eql('test fails')
  })
})
