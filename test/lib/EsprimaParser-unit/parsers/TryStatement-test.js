// spec: https://github.com/estree/estree/blob/master/spec.md#trystatement

describe('TryStatement tests', () => {
  let tryStatement

  beforeEach(() => {
    tryStatement = createAstNode('TryStatement', {
      block: createAstNode('BlockStatementBlock'),
      handler: createAstNode('CatchClause'),
      finalizer: createAstNode('BlockStatementFinalizer')
    })
    sandbox.stub(esprimaParser, 'handleExceptionBlock')
    sandbox.stub(esprimaParser, 'handleExceptionResult')
      .returns('resultFromHandleExceptionResult')
  })

  describe('no error thrown', () => {
    beforeEach(() => {
      esprimaParser.handleExceptionBlock
        .onCall(0).returns({valueFromTry: 'valueFromTryBlock'})
        .onCall(1).returns({valueFromFinally: 'valueFromFinallyBlock'})
    })

    it('should call handleExceptionBlock with tryStatement.block', () => {
      esprimaParser.TryStatement(tryStatement)

      expect(
        esprimaParser.handleExceptionBlock.getCall(0)
          .calledWithExactly(tryStatement.block)
      ).to.be.true
    })

    it('should call handleExceptionBlock with tryStatement.finalizer', () => {
      esprimaParser.TryStatement(tryStatement)

      expect(
        esprimaParser.handleExceptionBlock.getCall(1)
          .calledWithExactly(tryStatement.finalizer)
      ).to.be.true
    })

    it('should call exactly twice of handleExceptionBlock', () => {
      esprimaParser.TryStatement(tryStatement)

      expect(esprimaParser.handleExceptionBlock.calledTwice).to.be.true
    })

    it('should call handleExceptionResult with an object get updates from try and finally block and return', () => {
      const result = esprimaParser.TryStatement(tryStatement)

      expect(
        esprimaParser.handleExceptionResult
          .calledWithExactly({
            valueFromTry: 'valueFromTryBlock',
            valueFromFinally: 'valueFromFinallyBlock'
          })
      ).to.be.true
      expect(result).to.be.equal('resultFromHandleExceptionResult')
    })
  })

  describe('error thrown', () => {
    const error = new Error()

    beforeEach(() => {
      sandbox.stub(esprimaParser, 'handleCatchClause')
        .returns({valueFromCatch: 'valueFromCatch'})
      esprimaParser.handleExceptionBlock
        .onCall(0).throws(error)
        .onCall(1).returns({valueFromFinally: 'valueFromFinally'})
    })

    it('should call handleExceptionBlock with tryStatement.block', () => {
      esprimaParser.TryStatement(tryStatement)

      expect(
        esprimaParser.handleExceptionBlock.getCall(0)
          .calledWithExactly(tryStatement.block)
      ).to.be.true
    })

    it('should call handleCatchClause with tryStatement.handler and error thrown in try block', () => {
      esprimaParser.TryStatement(tryStatement)

      expect(
        esprimaParser.handleCatchClause
          .calledWithExactly(tryStatement.handler, error)
      ).to.be.true
    })

    it('should call handleExceptionBlock with tryStatement.finalizer', () => {
      esprimaParser.TryStatement(tryStatement)

      expect(
        esprimaParser.handleExceptionBlock.getCall(1)
          .calledWithExactly(tryStatement.finalizer)
      ).to.be.true
    })

    it('should call twice of handleExceptionBlock and once of handleCatchClause', () => {
      esprimaParser.TryStatement(tryStatement)

      expect(esprimaParser.handleCatchClause.calledOnce).to.be.true
      expect(esprimaParser.handleExceptionBlock.calledTwice).to.be.true
    })

    it('should call handleExceptionResult with an object get updates from catch and finally block and return', () => {
      const result = esprimaParser.TryStatement(tryStatement)

      expect(
        esprimaParser.handleExceptionResult
          .calledWithExactly({
            valueFromCatch: 'valueFromCatch',
            valueFromFinally: 'valueFromFinally'
          })
      ).to.be.true
      expect(result).to.be.equal('resultFromHandleExceptionResult')
    })
  })
})
