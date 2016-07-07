'use strict'

describe('getPropertyKeyOfValue tests', () => {
  it('should not call parseNode given computed false', () => {
    sandbox.stub(esprimaParser, 'parseNode', sandbox.spy())

    const emptyAstNode = createAstNode()
    esprimaParser.getPropertyKeyOfValue(emptyAstNode, false)

    expect(esprimaParser.parseNode.called).to.be.false
  })

  it('should return \'a\' given Identifier key name \'a\' and computed false', () => {
    expect(
      esprimaParser.getPropertyKeyOfValue(
        createAstNode('Identifier', {name: 'a'}),
        false
      )
    ).to.be.equal('a')
  })

  it('should return \'b\' given Literal key value \'b\' and computed false', () => {
    expect(
      esprimaParser.getPropertyKeyOfValue(
        createAstNode('Literal', {value: 'b'}),
        false
      )
    ).to.be.equal('b')
  })

  it('should call parseNode with key given computed true', () => {
    sandbox.stub(esprimaParser, 'parseNode', sandbox.spy())

    const emptyAstNode = createAstNode()
    esprimaParser.getPropertyKeyOfValue(emptyAstNode, true)

    expect(esprimaParser.parseNode.calledWithExactly(emptyAstNode)).to.be.true
  })

  it('should return \'b\' given Identifier key name \'a\', value \'b\' and computed true', () => {
    sandbox.stub(esprimaParser, 'parseNode', (node) => {
      if (node.type === 'Identifier' && node.name === 'a') {
        return 'b'
      }
    })

    expect(
      esprimaParser.getPropertyKeyOfValue(
        createAstNode('Identifier', {name: 'a'}),
        true
      )
    ).to.be.equal('b')
  })

  it('should return \'b\' given Literal key value \'b\' and computed true', () => {
    sandbox.stub(esprimaParser, 'parseNode', createLiteralStub())

    expect(
      esprimaParser.getPropertyKeyOfValue(
        createAstNode('Literal', {value: 'b'}),
        true
      )
    ).to.be.equal('b')
  })
})
