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
      sandbox.stub(esprimaParser, 'setErrorInCatchClause')
      sandbox.stub(esprimaParser, 'parseNode', createParseNodeStub())
    })

    it('should call setCatchClauseError with handler param and error', () => {
      esprimaParser.handleCatchClause(handler, error)

      expect(
        esprimaParser.setErrorInCatchClause
          .calledWithExactly(handler.param, error)
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
