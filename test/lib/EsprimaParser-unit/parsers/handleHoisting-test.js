describe('handleHoisting tests', () => {
  let statements

  beforeEach(() => {
    statements = [
      createAstNode('Statement1'),
      createAstNode('Statement2'),
      createAstNode('Statement3')
    ]
    sandbox.stub(esprimaParser, 'searchHoisting')
    sandbox.stub(esprimaParser, 'flagHoisting', {
      isSet: sandbox.stub(),
      unset: sandbox.stub()
    })
  })

  describe('flagHoisting is set', () => {
    beforeEach(() => {
      esprimaParser.flagHoisting.isSet.returns(true)
    })

    it('should call searchHoisting with statements', () => {
      esprimaParser.handleHoisting(statements)

      expect(
        esprimaParser.searchHoisting
          .calledWithExactly(statements)
      ).to.be.true
    })

    it('should call esprimaParser.flagHoisting.unset after searchHoisting', () => {
      esprimaParser.handleHoisting(statements)

      expect(esprimaParser.flagHoisting.unset.called).to.be.true
      expect(
        esprimaParser.flagHoisting.unset
          .calledAfter(esprimaParser.searchHoisting)
      ).to.be.true
    })
  })

  describe('flagHoisting is not set', () => {
    beforeEach(() => {
      esprimaParser.flagHoisting.isSet.returns(false)
    })

    it('should do nothing', () => {
      esprimaParser.handleHoisting(statements)

      expect(esprimaParser.searchHoisting.called).to.be.false
      expect(esprimaParser.flagHoisting.unset.called).to.be.false
    })
  })
})
