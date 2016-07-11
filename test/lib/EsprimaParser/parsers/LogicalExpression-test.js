// spec: https://github.com/estree/estree/blob/master/spec.md#logicalexpression

describe('LogicalExpression tests', () => {
  let logicalExpression

  beforeEach(() => {
    logicalExpression = createAstNode('LogicalExpression', {
      operator: 'possibleLogicalOperator',
      left: createAstNode('Literal', {value: 'left'}),
      right: createAstNode('Literal', {value: 'right'})
    })

    sandbox.stub(esprimaParser, 'parseNode', sandbox.spy((node) => {
      if (node.value === 'left') {
        return 'parsed left'
      }
      return 'parsed right'
    }))
    sandbox.stub(esprimaParser, 'logicalOperators', {
      'possibleLogicalOperator': sandbox.spy(() => {
        return 'resultFromPossibleLogicalOperator'
      })
    })
  })

  it('should call parseNode with left', () => {
    esprimaParser.LogicalExpression(logicalExpression)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(logicalExpression.left)
    ).to.be.true
  })

  it('should call parseNode with right', () => {
    esprimaParser.LogicalExpression(logicalExpression)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(logicalExpression.right)
    ).to.be.true
  })

  it('should call proper logical operation with parsed left and right', () => {
    const result = esprimaParser.LogicalExpression(logicalExpression)

    expect(
      esprimaParser.logicalOperators.possibleLogicalOperator
        .calledWithExactly('parsed left', 'parsed right')
    ).to.be.true
    expect(result).to.be.equal('resultFromPossibleLogicalOperator')
  })
})
