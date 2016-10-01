describe.only('hoisting tests', () => {
  let closureStack

  beforeEach(() => {
    closureStack = esprimaParser.closureStack
  })

  it('should handle hoisting properly (1)', () => {
    const ast = esprima.parse(`
      var a = 1;

      var result = (function () {
        return a;
        var a;
      })()
    `)
    esprimaParser.parseAst(ast)

    expect(closureStack.get('result')).to.be.undefined
  })

  it('should handle hoisting properly (2)', () => {
    const ast = esprima.parse(`
      var a = 1;
      var result = (function () {
        a = 2;
        var a;

        return a;
      })()
    `)
    esprimaParser.parseAst(ast)

    expect(closureStack.get('a')).to.be.equal(1)
    expect(closureStack.get('result')).to.be.equal(2)
  })

  it('should handle hoisting properly (3)', () => {
    const ast = esprima.parse(`
      var a = 1;
      var result = (function () {
        for (var a; false;);
        a = 2;

        return a;
      })()
    `)
    esprimaParser.parseAst(ast)

    expect(closureStack.get('a')).to.be.equal(1)
    expect(closureStack.get('result')).to.be.equal(2)
  })

  it('should handle hoisting properly (4)', () => {
    const ast = esprima.parse(`
      var result = (function test(a) {
        var result = [];

        result.push(a); // 1

        var a = 2;

        result.push(a); // 2

        return result
      })(1)
    `)
    esprimaParser.parseAst(ast)

    expect(closureStack.get('result')).to.be.eql([1, 2])
  })

  it('should handle hoisting in function expreission with id', () => {
    const ast = esprima.parse(`
      var result = (function test() {
        return test; // undefined
        var test;
      })()
    `)
    esprimaParser.parseAst(ast)

    expect(closureStack.get('result')).to.be.undefined
  })

  it('should take last result as valid (in Chrome, but not Safari)', () => {
    const ast = esprima.parse(`
      if (true) {
        function test() {
          return 2
        }
      }
      var result = test();

      function test() {
        return 1
      }
    `)
    esprimaParser.parseAst(ast)

    // @NOTE: this case in Safari should return 1
    expect(closureStack.get('result')).to.be.equal(2)
  })
})
