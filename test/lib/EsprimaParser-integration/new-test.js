// Standard built-in objects https://goo.gl/jvqc2d

describe('new tests', () => {
  let closureStack

  beforeEach(() => {
    closureStack = esprimaParser.closureStack
  })

  it('should handle Array instance', () => {
    const ast = esprima.parse(`
      var a = new Array(1, 2, 3)
    `)
    esprimaParser.parseAst(ast)

    expect(closureStack.get('a')).to.be.instanceof(Array)
    expect(closureStack.get('a')).to.be.eql([1, 2, 3])
  })

  it('should handle Boolean instance', () => {
    const ast = esprima.parse(`
      var a = new Boolean(true)
    `)
    esprimaParser.parseAst(ast)

    expect(closureStack.get('a')).to.be.instanceof(Boolean)
    expect(closureStack.get('a').valueOf()).to.be.true
  })

  it('should handle Error instance', () => {
    const ast = esprima.parse(`
      var a = new Error('error')
    `)
    esprimaParser.parseAst(ast)

    expect(closureStack.get('a')).to.be.instanceof(Error)
    expect(closureStack.get('a').message).to.be.equal('error')
  })

  it('should handle Number instance', () => {
    const ast = esprima.parse(`
      var a = new Number(1)
    `)
    esprimaParser.parseAst(ast)

    expect(closureStack.get('a')).to.be.instanceof(Number)
    expect(closureStack.get('a').valueOf()).to.be.equal(1)
  })

  it('should handle Object instance', () => {
    const ast = esprima.parse(`
      var a = new Object(undefined);
      var b = new Object(true)
    `)
    esprimaParser.parseAst(ast)

    expect(closureStack.get('a')).to.be.instanceof(Object)
    expect(closureStack.get('a')).to.be.eql({})
    expect(closureStack.get('b')).to.be.instanceof(Boolean)
    expect(closureStack.get('b').valueOf()).to.be.true
  })

  it('should handle RegExp instance', () => {
    const ast = esprima.parse(`
      var a = /test/i;
      var b = new RegExp(/test/, 'i');
      var s = 'TEST'

      var result1 = a.test(s)
      var result2 = b.test(s)
    `)
    esprimaParser.parseAst(ast)

    expect(closureStack.get('result1')).to.be.true
    expect(closureStack.get('result2')).to.be.true
  })

  // it('should handle basic type (Array, Boolean, Error, Function, Number, Object, RegExp, String)', () => {
  // })
})
