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
})
