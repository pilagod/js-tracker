describe('getCalleeAgent tests', () => {
  const callee = 'callee'

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'CalleeAgent', function (callee) {
      this.callee = callee
    })
  })

  it('should return an new instance of CalleeAgent init with argument callee', () => {
    const result = esprimaParser.getCalleeAgent(callee)

    expect(result).to.be.instanceof(esprimaParser.CalleeAgent)
    expect(result.callee).to.be.equal(callee)
  })
})
