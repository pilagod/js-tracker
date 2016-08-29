describe('parseCallee tests', () => {
  let calleeExpression

  describe('calleeExpression is MemberExpression', () => {
    beforeEach(() => {
      calleeExpression = createAstNode('MemberExpression')

      sandbox.stub(esprimaParser, 'parseMemberCallee')
        .returns('resultFromParseMemberCallee')
    })

    it('should call parseMemberCallee with calleeExpression', () => {
      esprimaParser.parseCallee(calleeExpression)

      expect(
        esprimaParser.parseMemberCallee
          .calledWithExactly(calleeExpression)
      ).to.be.true
    })

    it('should return result from parseMemberCallee', () => {
      const result = esprimaParser.parseCallee(calleeExpression)

      expect(result).to.be.equal('resultFromParseMemberCallee')
    })
  })

  describe('calleeExpression other than MemberExpression', () => {
    beforeEach(() => {
      calleeExpression = createAstNode('Expression')

      sandbox.stub(esprimaParser, 'parseOtherCallee')
        .returns('resultFromParseOtherCallee')
    })

    it('should call parseOtherCallee with calleeExpression', () => {
      esprimaParser.parseCallee(calleeExpression)

      expect(
        esprimaParser.parseOtherCallee
          .calledWithExactly(calleeExpression)
      ).to.be.true
    })

    it('should return result from parseOtherCallee', () => {
      const result = esprimaParser.parseCallee(calleeExpression)

      expect(result).to.be.equal('resultFromParseOtherCallee')
    })
  })
})
