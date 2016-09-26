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

      var c = (function () {
        var result;

        try {
          result = 1;
          return result;
        } finally {
          result = 3;
        }
      })();

      var d = (function () {
        var result;

        try {
          result = 1;
          return result;
        } finally {
          result = 3;
          return result;
        }
      })();
    `)
    esprimaParser.parseAst(ast)

    expect(closureStack.get('a')).to.be.equal(3)
    expect(closureStack.get('b')).to.be.equal(3)
    expect(closureStack.get('c')).to.be.equal(1)
    expect(closureStack.get('d')).to.be.equal(3)
  })

  it('should set back closureStack if error thrown in function call', () => {
    const ast = esprima.parse(`
      function error() {
        var a = 2;
        throw new Error()
      }
      var a = (function () {
        var result = 1;

        try {
          error();
        } catch (e) {
          return result;
        }
      })();
    `)
    esprimaParser.parseAst(ast)

    expect(closureStack.get('a')).to.be.equal(1)
  })

  it('should return proper value and set flowState properly in function', () => {
    const ast = esprima.parse(`
      function returnTrue() {
        return true
      }

      function returnFalse() {
        return false
      }

      var a = (function () {
        try {
          throw new Error();
        } catch (e) {
          return returnFalse();
        }
        return true;
      })();

      var b = (function () {
        try {
          throw new Error();
        } finally {
          return returnFalse();
        }
        return true;
      })();

      var c = (function () {
        try {
          throw new Error();
        } catch (e) {
          return returnTrue();
        } finally {
          return returnFalse();
        }
        return undefined
      })();

      var d = (function () {
        try {
          return returnTrue();
        } finally {
          return returnFalse();
        }
        return undefined
      })();
    `)
    esprimaParser.parseAst(ast)

    expect(closureStack.get('a')).to.be.false
    expect(closureStack.get('b')).to.be.false
    expect(closureStack.get('c')).to.be.false
    expect(closureStack.get('d')).to.be.false
  })
})
