describe('function', () => {
  let closureStack

  beforeEach(() => {
    closureStack = esprimaParser.closureStack
  })

  describe('closure tests', () => {
    it('should keep current closureStack', () => {
      resetVariables('a')

      const ast = esprima.parse(`
        var test = function () {
          return a;
        };
        var result1 = test();

        var a = 2;
        var result2 = test();

        a = 3;
        var result3 = test();
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('result1')).to.be.undefined
      expect(closureStack.get('result2')).to.be.equal(2)
      expect(closureStack.get('result3')).to.be.equal(3)
    })

    it('should create a new closure in function', () => {
      resetVariables('a')

      const ast = esprima.parse(`
        var a = 1;

        var test = function () {
          var a = 2;

          return a;
        };
        var result = test()
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.equal(1)
      expect(closureStack.get('result')).to.be.equal(2)
    })
  })

  describe('bind, call, apply tests', () => {
    it('should bind context properly', () => {
      const ast = esprima.parse(`
        this.a = 9;

        var test = {
          a: 81,
          getA: function () {
            return this.a;
          }
        };
        var result1 = test.getA();

        var getA = test.getA;
        var result2 = getA();

        var boundGetA = getA.bind(test);
        var result3 = boundGetA();
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('result1')).to.be.equal(81)
      expect(closureStack.get('result2')).to.be.equal(9)
      expect(closureStack.get('result3')).to.be.equal(81)
    })
  })
})
