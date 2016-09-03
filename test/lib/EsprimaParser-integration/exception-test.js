describe('exception tests', () => {
  let closureStack

  beforeEach(() => {
    closureStack = esprimaParser.closureStack
  })

  it('should not execute catch block given no error threw', () => {
    const ast = esprima.parse(`
      var a = (function () {
        var result;

        try {
          result = 1;
        } catch (e) {
          result = 2;
        }
        return result;
      })();
    `)
    esprimaParser.parseAst(ast)

    expect(closureStack.get('a')).to.be.equal(1)
  })

  it('should catch error threw in try block', () => {
    const ast = esprima.parse(`
      var a = (function () {
        try {
          throw 'error';
        } catch (e) {
          return e;
        }
      })();
    `)
    esprimaParser.parseAst(ast)

    expect(closureStack.get('a')).to.be.equal('error')
  })

  it('should always execute finally block', () => {
    const ast = esprima.parse(`
      var a = (function () {
        var result;

        try {
          result = 1;
        } finally {
          result = 3;
        }
        return result
      })();
      var b = (function () {
        var result;

        try {
          result = 1;
          throw 'error'
        } catch (e) {
          result = 2;
        } finally {
          result = 3;
        }
        return result
      })();
    `)
    esprimaParser.parseAst(ast)

    expect(closureStack.get('a')).to.be.equal(3)
    expect(closureStack.get('b')).to.be.equal(3)
  })
})
