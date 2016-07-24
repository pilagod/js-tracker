describe('handleCatchClause tests', () => {
  const error = new Error('error from block')
  let handler

  beforeEach(() => {
    handler = createAstNode('CatchClause', {
      param: createAstNode('Pattern'),
      body: createAstNode('BlockStatement')
    })
  })

  describe('given non-null handler', () => {
    beforeEach(() => {
      sandbox.stub(esprimaParser, 'getNameFromPattern')
        .returns('resultFromGetNameFromPattern')
      sandbox.stub(esprimaParser, 'setVariables')
      sandbox.stub(esprimaParser, 'parseNode', createParseNodeStub())
    })

    it('should call getNameFromPattern with handler param', () => {
      esprimaParser.handleCatchClause(handler, error)

      expect(
        esprimaParser.getNameFromPattern
          .calledWithExactly(handler.param)
      ).to.be.true
    })

    it('should call setVariables with result from getNameFromPattern and error', () => {
      esprimaParser.handleCatchClause(handler, error)

      expect(
        esprimaParser.setVariables
          .calledWithExactly('resultFromGetNameFromPattern', error)
      ).to.be.true
    })

    it('should call parseNode with handler body and return', () => {
      const result = esprimaParser.handleCatchClause(handler, error)

      expect(
        esprimaParser.parseNode
          .calledWithExactly(handler.body)
      ).to.be.true
      expect(result).to.be.equal('parsedBlockStatement')
    })
  })

  describe('given null handler', () => {
    it('should throw error got from block', () => {
      handler = null

      expect(
        esprimaParser.handleCatchClause
          .bind(esprimaParser, handler, error)
      ).to.throw(error)
    })
  })
})
