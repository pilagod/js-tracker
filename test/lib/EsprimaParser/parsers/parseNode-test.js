describe('parseNode tests', () => {
  let nodes

  beforeEach(() => {
    nodes = [
      createAstNode('Identifier'),
      createAstNode('ExpressionStatement'),
      createAstNode('VariableDeclaration'),
      createAstNode('CallExpression')
    ]

    sandbox.stub(esprimaParser)
    esprimaParser.parseNode.restore()
  })

  it('should call coresponding node parser according to node type and return', () => {
    for (const node of nodes) {
      esprimaParser.parseNode(node)

      expect(
        esprimaParser[node.type]
          .calledWithExactly(node)
      ).to.be.true
    }
  })

  it('should return from node parser', () => {
    for (const node of nodes) {
      const expected = `parsed${node.type}`
      esprimaParser[node.type].returns(expected)

      const result = esprimaParser.parseNode(node)

      expect(result).to.be.equal(expected)
    }
  })

  it('should do nothing and return undefined given null node', () => {
    const result = esprimaParser.parseNode(null)

    for (const node of nodes) {
      expect(esprimaParser[node.type].called).to.be.false
    }
    expect(result).to.be.undefined
  })
})
