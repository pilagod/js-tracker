describe('call tests', () => {
  let closureStack

  beforeEach(() => {
    closureStack = esprimaParser.closureStack
  })

  it('should return [\'\'] from \'\'.split(\'.\')', () => {
    const ast = esprima.parse(`
      var result = ''.split('.');
    `)
    esprimaParser.parseAst(ast)

    expect(closureStack.get('result')).to.be.eql([''])
  })
})
