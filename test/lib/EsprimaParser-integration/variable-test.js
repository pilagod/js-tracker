describe('variable tests', () => {
  let closureStack

  beforeEach(() => {
    closureStack = esprimaParser.closureStack
  })

  it('should set basic value (Number, String, Boolean) properly', () => {
    const ast = esprima.parse(`
      var a = 1;
      var b = 'string';
      var c = true;
    `)
    esprimaParser.parseAst(ast)

    expect(closureStack.get('a')).to.be.equal(1)
    expect(closureStack.get('b')).to.be.equal('string')
    expect(closureStack.get('c')).to.be.true
  })

  it('should set compound value (Array, Object) properly', () => {
    const ast = esprima.parse(`
      var a = {
        'a': 1,
        'b': {
          'c': [{}, 2, 3]
        }
      };
      var b = [1, [2, 3], {}];
    `)
    esprimaParser.parseAst(ast)

    expect(closureStack.get('a')).to.be.eql({
      'a': 1,
      'b': {
        'c': [{}, 2, 3]
      }
    })
    expect(closureStack.get('b')).to.be.eql([1, [2, 3], {}])
  })

  it('should set simple value (null, undefined) properly', () => {
    const ast = esprima.parse(`
      var a = null;
      var b = undefined;
    `)
    esprimaParser.parseAst(ast)

    expect(closureStack.get('a')).to.be.null
    expect(closureStack.get('b')).to.be.undefined
  })

  it('should set member value properly', () => {
    const ast = esprima.parse(`
      var a = {
        'num': 1
      };
      var b = a.num;
      var c = a['num'];
    `)
    esprimaParser.parseAst(ast)

    expect(closureStack.get('a')).to.be.eql({num: 1})
    expect(closureStack.get('b')).to.be.equal(1)
    expect(closureStack.get('c')).to.be.equal(1)
  })

  it('should set function value properly', () => {
    const ast = esprima.parse(`
      var a = function (num) {
        return num
      };
      var b = a(2);
    `)
    esprimaParser.parseAst(ast)

    expect(closureStack.get('a')(1)).to.be.equal(1)
    expect(closureStack.get('b')).to.be.equal(2)
  })

  it('should set function declaration properly', () => {
    const ast = esprima.parse(`
      function test () {
        return true
      }
    `)
    esprimaParser.parseAst(ast)

    expect(closureStack.get('test')()).to.be.true
  })

  it('should not set duplicate but no init declaration', () => {
    const ast = esprima.parse(`
      var isFunction = function () {
        return true;
      };
      var isFunction;
      var result = isFunction();
    `)
    esprimaParser.parseAst(ast)

    expect(closureStack.get('isFunction')).is.a('function')
    expect(closureStack.get('result')).to.be.true
  })

  it('should set variable to global context given not declared by \'var\' first', () => {
    resetVariables('result')

    const ast = esprima.parse(`
      result = 1;
    `)
    esprimaParser.parseAst(ast)

    expect(esprimaParser.context).to.have.property('result', 1)
    expect(closureStack.get('result')).to.be.equal(1)
  })

  it('should handle hoisting properly', () => {
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
})
