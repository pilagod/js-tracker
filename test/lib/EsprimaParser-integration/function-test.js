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

  describe.only('bind, call, apply tests', () => {
    it('should bind context properly (1)', () => {
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

    it('should bind context properly (2)', () => {
      const ast = esprima.parse(`
        var list = function () {
          return Array.prototype.slice.call(arguments)
        }
        var list1 = list(1, 2, 3);
        var leadingThirtysevenList = list.bind(undefined, 37);
        var list2 = leadingThirtysevenList();
        var list3 = leadingThirtysevenList(1, 2, 3);
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('list1')).to.be.eql([1, 2, 3])
      expect(closureStack.get('list2')).to.be.eql([37])
      expect(closureStack.get('list3')).to.be.eql([37, 1, 2, 3])
    })
  })
})
