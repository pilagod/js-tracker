describe('parseNode tests', () => {
  const options = {
    key: 'value'
  }
  let nodes

  beforeEach(() => {
    nodes = [
      createAstNode('Identifier'),
      createAstNode('ExpressionStatement'),
      createAstNode('VariableDeclaration'),
      createAstNode('CallExpression')
    ]
    sandbox.stub(esprimaParser) // stub all parsers
    esprimaParser.parseNode.restore()
  })

  it('should return result from coresponding node parser called with node and undefined given no options', () => {
    for (const node of nodes) {
      esprimaParser.parseNode(node)

      expect(
        esprimaParser[node.type]
          .calledWithExactly(node, undefined)
      ).to.be.true
    }
  })

  it('should return result from coresponding node parser called with node and options given valid options', () => {
    for (const node of nodes) {
      esprimaParser.parseNode(node, options)

      expect(
        esprimaParser[node.type]
          .calledWithExactly(node, options)
      ).to.be.true
    }
  })

  it('should return result from node parser', () => {
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
