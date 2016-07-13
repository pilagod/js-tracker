// spec: https://github.com/estree/estree/blob/master/spec.md#sequenceexpression

describe('SequenceExpression tests', () => {
  let sequenceExpression

  beforeEach(() => {
    sequenceExpression = createAstNode('SequenceExpression', {
      expressions: [
        createAstNode('Literal', {value: 'first'}),
        createAstNode('Literal', {value: 'second'}),
        createAstNode('Literal', {value: 'third'})
      ]
    })

    sandbox.stub(esprimaParser, 'parseNode', sandbox.spy(createLiteralStub()))
  })

  it('should call parseNode with each expression', () => {
    esprimaParser.SequenceExpression(sequenceExpression)

    sequenceExpression.expressions.forEach((expression, index) => {
      expect(
        esprimaParser.parseNode
          .getCall(index)
          .calledWithExactly(expression)
      ).to.be.true
    })
    expect(esprimaParser.parseNode.calledThrice).to.be.true
  })

  it('should return last expression result', () => {
    const result = esprimaParser.SequenceExpression(sequenceExpression)

    expect(result).to.be.equal('third')
  })
})
