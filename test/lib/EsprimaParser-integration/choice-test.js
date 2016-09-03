describe('choice', () => {
  let closureStack

  beforeEach(() => {
    closureStack = esprimaParser.closureStack
  })

  describe('if tests', () => {
    it('should execute proper branch', () => {
      const ast = esprima.parse(`
        var test = function (num) {
          if (num === 1) {
            return num + 1
          } else if (num === 2) {
            return num + 2
          } else {
            return num - 1
          }
        };
        var a = test(1);
        var b = test(a);
        var c = test(b);
        var d = test(c);
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.equal(2)
      expect(closureStack.get('b')).to.be.equal(4)
      expect(closureStack.get('c')).to.be.equal(3)
      expect(closureStack.get('d')).to.be.equal(2)
    })
  })

  describe('switch tests', () => {
    it('should execute proper branch', () => {
      const ast = esprima.parse(`
        var test = function (num) {
          switch (num) {
            case 1:
              return 'case 1';
            case 2:
              return 'case 2';
            default:
              return 'case other';
          }
        };
        var a = test(1);
        var b = test(2);
        var c = test(3);
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.equal('case 1')
      expect(closureStack.get('b')).to.be.equal('case 2')
      expect(closureStack.get('c')).to.be.equal('case other')
    })
  })
})
