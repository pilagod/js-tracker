describe('getCallee tests', () => {
  const method = 'method'

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'Callee', function (method) {
      this.method = method
    })
  })

  it('should return an new instance of CalleeAgent init with argument method', () => {
    const result = esprimaParser.getCallee(method)

    expect(result).to.be.instanceof(esprimaParser.Callee)
    expect(result.method).to.be.equal(method)
  })
})
