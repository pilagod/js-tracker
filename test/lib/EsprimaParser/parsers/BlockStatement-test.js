// spec: https://github.com/estree/estree/blob/master/spec.md#blockstatement

describe('BlockStatement tests', () => {
  let blockStatement

  beforeEach(() => {
    blockStatement = createAstNode('BlockStatement')

    sandbox.stub(esprimaParser, 'parseNode', sandbox.spy((node) => {
      switch (node.type) {
        case 'ReturnStatement':
          return 'RETURN'
        case 'ContinueStatement':
          return 'CONTINUE'
        case 'BreakStatement':
          return 'BREAK'
        default:
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

  for (const [type, expectedResult] of [
    ['ReturnStatement', 'RETURN'],
    ['ContinueStatement', 'CONTINUE'],
    ['BreakStatement', 'BREAK']
  ]) {
    it(`should stop immediately and return when it occurs ${type}`, () => {
      blockStatement.body = [
        createAstNode(),
        createAstNode(type),
        createAstNode('NeverCalled')
      ]

      const result = esprimaParser.BlockStatement(blockStatement)

      expect(esprimaParser.parseNode.calledTwice).to.be.true
      expect(
        esprimaParser.parseNode
          .neverCalledWith(blockStatement.body[2])
      ).to.be.true
      expect(result).to.be.equal(expectedResult)
    })
  }
})
