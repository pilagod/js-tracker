// spec: https://github.com/estree/estree/blob/master/spec.md#blockstatement

describe('BlockStatement tests', () => {
  let blockStatement

  beforeEach(() => {
    blockStatement = createAstNode('BlockStatement')

    sandbox.stub(esprimaParser, 'parseNode', sandbox.spy((node) => {
      if (node.type === 'FlowControlStatement') {
        // ReturnStatement, ContinueStatement, BreakStatement
        return 'flowControlSignal'
      }
    }))
  })

  it('should call parseNode with each body node', () => {
    blockStatement.body = [
      createAstNode(),
      createAstNode(),
      createAstNode()
    ]

    esprimaParser.BlockStatement(blockStatement)

    blockStatement.body.forEach((node, index) => {
      expect(
        esprimaParser.parseNode
          .getCall(index)
          .calledWithExactly(node)
      ).to.be.true
    })
  })

  it('should return undefined given no flow control statement', () => {
    blockStatement.body = [
      createAstNode(),
      createAstNode(),
      createAstNode()
    ]

    const result = esprimaParser.BlockStatement(blockStatement)

    expect(result).to.be.undefined
  })

  it('should stop immediately and return when it occurs flow control statement', () => {
    // ReturnStatement, ContinueStatement, BreakStatement
    blockStatement.body = [
      createAstNode(),
      createAstNode('FlowControlStatement'),
      createAstNode('NeverCalledNode')
    ]

    const result = esprimaParser.BlockStatement(blockStatement)

    expect(esprimaParser.parseNode.calledTwice).to.be.true
    expect(
      esprimaParser.parseNode
        .neverCalledWith(blockStatement.body[2])
    ).to.be.true
    expect(result).to.be.equal('flowControlSignal')
  })
})
