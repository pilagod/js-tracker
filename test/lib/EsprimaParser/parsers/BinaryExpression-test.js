'use strict'

// spec: https://github.com/estree/estree/blob/master/spec.md#binaryexpression

describe('BinaryExpression tests', () => {
  let binaryExpression

  beforeEach(() => {
    binaryExpression = createAstNode('BinaryExpression', {
      operator: 'possibleBinaryOperator',
      left: createAstNode('Literal', {value: 'left'}),
      right: createAstNode('Literal', {value: 'right'})
    })

    sandbox.stub(esprimaParser, 'parseNode', sandbox.spy((node) => {
      if (node.value === 'left') {
        return 'parsed left'
      } else if (node.value === 'right') {
        return 'parsed right'
      }
    }))
    sandbox.stub(esprimaParser, 'binaryOperators', {
      'possibleBinaryOperator': sandbox.spy(() => {
        return 'resultFromPossibleBinaryOperator'
      })
    })
  })

  it('should call parseNode with left', () => {
    esprimaParser.BinaryExpression(binaryExpression)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(binaryExpression.left)
    ).to.be.true
  })

  it('should call parseNode with right', () => {
    esprimaParser.BinaryExpression(binaryExpression)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(binaryExpression.right)
    ).to.be.true
  })

  it('should call binary operation with parsed left and right then return the result', () => {
    const result = esprimaParser.BinaryExpression(binaryExpression)

    expect(
      esprimaParser.binaryOperators.possibleBinaryOperator
        .calledWithExactly('parsed left', 'parsed right')
    ).to.be.true
    expect(result).to.be.equal('resultFromPossibleBinaryOperator')
  })
})
