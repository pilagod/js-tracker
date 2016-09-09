// spec: https://github.com/estree/estree/blob/master/spec.md#logicaloperator

describe('LogicalOperator tests', () => {
  let left, right

  before(() => {
    left = createAstNode('ExpressionLeft')
    right = createAstNode('ExpressionRight')
  })

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'parseNode')
  })

  describe('|| tests', () => {
    it('should call parseNode with left only given the result is true', () => {
      esprimaParser.parseNode.withArgs(left).returns(true)

      const result = esprimaParser.logicalOperators['||'](left, right)

      expect(esprimaParser.parseNode.calledOnce).to.be.true
      expect(
        esprimaParser.parseNode
          .calledWithExactly(left)
      ).to.be.true
      expect(result).to.be.true
    })

    it('should call parseNode with right and return given the result of parseNode called with left is false', () => {
      esprimaParser.parseNode.withArgs(left).returns(false)
      esprimaParser.parseNode.withArgs(right).returns('resultFromRight')

      const result = esprimaParser.logicalOperators['||'](left, right)

      expect(esprimaParser.parseNode.calledTwice).to.be.true
      expect(
        esprimaParser.parseNode
          .calledWithExactly(left)
      ).to.be.true
      expect(
        esprimaParser.parseNode
          .calledWithExactly(right)
      ).to.be.true
      expect(result).to.be.equal('resultFromRight')
    })
  })

  describe('&& tests', () => {
    it('should call parseNode with left only given the result is false', () => {
      esprimaParser.parseNode.withArgs(left).returns(false)

      const result = esprimaParser.logicalOperators['&&'](left, right)

      expect(esprimaParser.parseNode.calledOnce).to.be.true
      expect(
        esprimaParser.parseNode
          .calledWithExactly(left)
      ).to.be.true
      expect(result).to.be.false
    })
  })

  it('should call parseNode with right and return given the result of parseNode called with left is true', () => {
    esprimaParser.parseNode.withArgs(left).returns(true)
    esprimaParser.parseNode.withArgs(right).returns('resultFromRight')

    const result = esprimaParser.logicalOperators['&&'](left, right)

    expect(esprimaParser.parseNode.calledTwice).to.be.true
    expect(
      esprimaParser.parseNode
        .calledWithExactly(left)
    ).to.be.true
    expect(
      esprimaParser.parseNode
        .calledWithExactly(right)
    ).to.be.true
    expect(result).to.be.equal('resultFromRight')
  })
})
