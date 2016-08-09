describe('getEnvironment tests', () => {
  beforeEach(() => {
    sandbox.stub(esprimaParser, 'scriptUrl', 'scriptUrlStub')
    sandbox.stub(esprimaParser, 'closureStack', 'closureStackStub')
  })

  it('should return and object containing esprimaParser current scriptUrl and closureStack', () => {
    const result = esprimaParser.getEnvironment()

    expect(result).to.be.eql({
      scriptUrl: 'scriptUrlStub',
      closureStack: 'closureStackStub'
    })
  })
})
