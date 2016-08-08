describe('createNewConstructor tests', () => {
  it('should return an empty function', () => {
    const result = esprimaParser.createNewConstructor()

    expect(result).to.be.instanceof(Function)
    expect(result.prototype).to.be.eql({})
  })
})
