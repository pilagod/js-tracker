describe('sequence tests', () => {
  let closureStack

  beforeEach(() => {
    closureStack = esprimaParser.closureStack
  })

  it('should execute each expressions and return last result', () => {
    const ast = esprima.parse(`
      var a = (function () {
        var a = 0;

        return a + 1, a + 2, a + 3;
      })()
    `)
    esprimaParser.parseAst(ast)

    expect(closureStack.get('a')).to.be.equal(3)
  })
})
