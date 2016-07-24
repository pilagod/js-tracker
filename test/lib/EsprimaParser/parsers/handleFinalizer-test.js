describe('handleFinalizer tests', () => {
  let finalizer

  beforeEach(() => {
    finalizer = createAstNode('BlockStatement')

    sandbox.stub(esprimaParser, 'parseNode', createParseNodeStub())
  })

  it('should call parseNode with finalizer and return given non-null finalizer', () => {
    const result = esprimaParser.handleFinalizer(finalizer)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(finalizer)
    ).to.be.true
    expect(result).to.be.equal('parsedBlockStatement')
  })

  it('should not call parseNode and return undefined given null finalizer', () => {
    finalizer = null
    
    const result = esprimaParser.handleFinalizer(finalizer)

    expect(esprimaParser.parseNode.called).to.be.false
    expect(result).to.be.undefined
  })
})
