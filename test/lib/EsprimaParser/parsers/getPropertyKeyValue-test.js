describe('getPropertyKeyValue tests', () => {
  for (const computed of [false, true]) {
    it(`should ${computed ? '' : 'not '}call parseNode ${computed ? 'with key ' : ''}given computed ${computed}`, () => {
      const key = createAstNode('Expression')

      sandbox.stub(esprimaParser, 'parseNode')

      esprimaParser.getPropertyKeyValue(key, computed)

      if (computed) {
        // should call with key given computed true
        expect(
          esprimaParser.parseNode
            .calledWithExactly(key)
        ).to.be.true
      } else {
        // should not call given computed false
        expect(esprimaParser.parseNode.called).to.be.false
      }
    })

    it(`should return \'${computed ? 'b' : 'a'}\' given Identifier key name \'a\'${computed ? ', value \'b\'' : ''} and computed ${computed}`, () => {
      const key = createAstNode('Identifier', {name: 'a'})

      if (computed) {
        sandbox.stub(esprimaParser, 'parseNode')
          .returns('b')
      }

      const result = esprimaParser.getPropertyKeyValue(key, computed)

      expect(result).to.be.equal(computed ? 'b' : 'a')
    })

    it(`should return \'b\' given Literal key value \'b\' and computed ${computed}`, () => {
      const key = createAstNode('Literal', {value: 'b'})

      if (computed) {
        sandbox.stub(esprimaParser, 'parseNode')
          .returns('b')
      }

      const result = esprimaParser.getPropertyKeyValue(key, computed)

      expect(result).to.be.equal('b')
    })
  }
})
