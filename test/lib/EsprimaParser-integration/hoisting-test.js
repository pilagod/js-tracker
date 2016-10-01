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
})
