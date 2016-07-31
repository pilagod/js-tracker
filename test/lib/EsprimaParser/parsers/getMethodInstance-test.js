describe('getMethodInstance tests', () => {
  const method = 'method'

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'Method', function (method) {
      this.method = method
    })
  })

  it('should return an instance of Method new with argument method', () => {
    const result = esprimaParser.getMethodInstance(method)

    expect(result).to.be.instanceof(esprimaParser.Method)
    expect(result.method).to.be.equal(method)
  })
})
