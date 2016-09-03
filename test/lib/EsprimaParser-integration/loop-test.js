describe('loop', () => {
  let closureStack, flowState

  beforeEach(() => {
    closureStack = esprimaParser.closureStack
    flowState = esprimaParser.flowState
  })

  /*************************/
  /*         while         */
  /*************************/

  describe('while tests', () => {
    it('should loop until test fails', () => {
      const ast = esprima.parse(`
        var a = 0;
        while (++a < 10);
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.equal(10)
    })

    it('should loop until break', () => {
      const ast = esprima.parse(`
        var a = 0;

        while (++a < 10) {
          if (a === 5) {
            break;
          }
        }
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.equal(5)
      expect(flowState.state).to.be.undefined
    })

    it('should loop until return', () => {
      const ast = esprima.parse(`
        var a = (function () {
          var count = 0;

          while (++count < 10) {
            if (count === 5) {
              return count
            }
          }
        })();
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.equal(5)
      expect(flowState.state).to.be.undefined
    })

    it('should loop next when continue met', () => {
      const ast = esprima.parse(`
        var a = 0;

        while (++a < 10) {
          continue;
          a = 100;
        }
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.equal(10)
      expect(flowState.state).to.be.undefined
    })
  })

  /*************************/
  /*        do while       */
  /*************************/

  describe('do while tests', () => {
    it('should loop until test fails', () => {
      const ast = esprima.parse(`
        var a = 10;

        do {
          a++;
        } while (a < 10)
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.equal(11)
    })

    it('should loop until break', () => {
      const ast = esprima.parse(`
        var a = 0;

        do {
          if (++a === 5) {
            break
          }
        } while (a < 10)
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.equal(5)
      expect(flowState.state).to.be.undefined
    })

    it('should loop until return', () => {
      const ast = esprima.parse(`
        var a = (function () {
          var count = 0;

          do {
            if (++count === 5) {
              return count
            }
          } while (count < 10)
        })();
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.equal(5)
      expect(flowState.state).to.be.undefined
    })

    it('should loop next when continue met', () => {
      const ast = esprima.parse(`
        var a = 0;

        do {
          continue;
          a = 100
        } while (++a < 10)
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.equal(10)
      expect(flowState.state).to.be.undefined
    })
  })

  /*************************/
  /*          for          */
  /*************************/

  describe('for tests', () => {
    it('should loop until test fails', () => {
      const ast = esprima.parse(`
        var a = 0;

        for (; a < 10; a ++);
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.equal(10)
    })

    it('should loop until break', () => {
      const ast = esprima.parse(`
        var a = 0;

        for (; a < 10; a ++) {
          if (a === 5) {
            break
          }
        }
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.equal(5)
      expect(flowState.state).to.be.undefined
    })

    it('should loop until return', () => {
      const ast = esprima.parse(`
        var a = (function () {
          for (var count = 0; count < 10; count ++) {
            if (count === 5) {
              return count
            }
          }
        })();
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.equal(5)
      expect(flowState.state).to.be.undefined
    })

    it('should loop next when continue met', () => {
      const ast = esprima.parse(`
        var a = 0;

        for (; a < 10; a ++) {
          continue;
          a = 100;
        }
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.equal(10)
      expect(flowState.state).to.be.undefined
    })
  })

  /*************************/
  /*        for in         */
  /*************************/

  describe('for in tests', () => {
    it('should loop to last element', () => {
      const ast = esprima.parse(`
        var a = '';
        var b = 0;
        var object = {
          'a': 1,
          'b': 2,
          'c': 3
        }
        for (var key in object) {
          a += key;
          b += object[key];
        }
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.equal('abc')
      expect(closureStack.get('b')).to.be.equal(6)
    })

    it('should loop until break', () => {
      const ast = esprima.parse(`
        var a = '';
        var b = 0;
        var object = {
          'a': 1,
          'b': 2,
          'c': 3
        }
        for (var key in object) {
          a += key;
          b += object[key];

          if (key === 'b') {
            break
          }
        }
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.equal('ab')
      expect(closureStack.get('b')).to.be.equal(3)
    })

    it('should loop until return', () => {
      const ast = esprima.parse(`
        var result = (function () {
          var a = '';
          var b = 0;
          var object = {
            'a': 1,
            'b': 2,
            'c': 3
          }
          for (var key in object) {
            a += key;
            b += object[key];

            if (key === 'b') {
              return {
                'a': a,
                'b': b
              }
            }
          }
        })();
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('result').a).to.be.equal('ab')
      expect(closureStack.get('result').b).to.be.equal(3)
    })

    it('should loop next when continue met', () => {
      const ast = esprima.parse(`
        var a = '';
        var b = 0;
        var object = {
          'a': 1,
          'b': 2,
          'c': 3
        }
        for (var key in object) {
          continue;
          a += key;
          b += object[key];
        }
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.equal('')
      expect(closureStack.get('b')).to.be.equal(0)
    })
  })
})
