describe('getNameFromPattern tests', () => {
  let node

  it('should return Identifier.name given node type Identifier', () => {
    node = createAstNode('Identifier', {
      name: 'variable'
    })
    const result = esprimaParser.getNameFromPattern(node)

    expect(result).to.be.equal(node.name)
  })

  it('should return undefined given unknown node type', () => {
    node = createAstNode('UnknownType')

    const result = esprimaParser.getNameFromPattern(node)

    expect(result).to.be.undefined
  })
})
