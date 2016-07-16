describe('getPropertyKeyValue tests', () => {
  for (const computed of [false, true]) {
    it(`should ${computed ? '' : 'not '}call parseNode ${computed ? 'with key ' : ''}given computed ${computed}`, () => {
      sandbox.stub(esprimaParser, 'parseNode', sandbox.spy())

      const key = createAstNode() // empty ast node
      esprimaParser.getPropertyValue(key, computed)

      if (computed) {
        // should call with key given computed true
        expect(esprimaParser.parseNode.calledWithExactly(key)).to.be.true
      } else {
        // should not call given computed false
        expect(esprimaParser.parseNode.called).to.be.false
      }
    })

    it(`should return \'${computed ? 'b' : 'a'}\' given Identifier key name \'a\'${computed ? ', value \'b\'' : ''} and computed ${computed}`, () => {
      if (computed) {
        sandbox.stub(esprimaParser, 'parseNode', () => {
          return 'b'
        })
      }

      const result = esprimaParser.getPropertyValue(
        createAstNode('Identifier', {name: 'a'}),
        computed
      )

      expect(result).to.be.equal(computed ? 'b' : 'a')
    })

    it(`should return \'b\' given Literal key value \'b\' and computed ${computed}`, () => {
      if (computed) {
        sandbox.stub(esprimaParser, 'parseNode', createLiteralStub())
      }

      const result = esprimaParser.getPropertyValue(
        createAstNode('Literal', {value: 'b'}),
        computed
      )

      expect(result).to.be.equal('b')
    })
  }
})
