describe('hasNoParent tests', () => {
  it('should return false given non-object object', () => {
    const object = 1
    const result = esprimaParser.hasNoParent(object)

    expect(result).to.be.false
  })

  it('should return true given object object has no parent property', () => {
    const object = {}

    const result = esprimaParser.hasNoParent(object)

    expect(result).to.be.true
  })

  it('should return false given object object has parent property', () => {
    const object = {
      parent: 'parent'
    }
    const result = esprimaParser.hasNoParent(object)

    expect(result).to.be.false
  })
})
