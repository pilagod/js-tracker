describe('handleCatchClause tests', () => {
  const error = new Error()

  describe('null catchClause', () => {
    const catchClause = null

    it('should return an object containing given error', () => {
      const result = esprimaParser.handleCatchClause(catchClause, error)

      expect(result).to.be.eql({error})
    })
  })

  describe('valid catchClause', () => {
    let catchClause

    beforeEach(() => {
      catchClause = createAstNode('CatchClause')

      sandbox.stub(esprimaParser, 'parseCatchClause')
    })

    it('should call parseCatchClause with catchClause and error and return', () => {
      const resultFromParseCatchClause = {value: 'value'}

      esprimaParser.parseCatchClause
        .returns(resultFromParseCatchClause)

      const result = esprimaParser.handleCatchClause(catchClause, error)

      expect(result).to.be.equal(resultFromParseCatchClause)
    })

    it('should return an object containing error thrown from parseCatchClause given parseCatchClause throws error', () => {
      const errorFromParseCatchClause = new Error('errorFromParseCatchClause')

      esprimaParser.parseCatchClause
        .throws(errorFromParseCatchClause)

      const result = esprimaParser.handleCatchClause(catchClause, error)

      expect(result).to.be.eql({
        error: errorFromParseCatchClause
      })
    })
  })
})
