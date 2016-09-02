describe('handleAssignOperation tests', () => {
  const value = 'new value'

  it('should call updateVariables with property and value given no object reference', () => {
    const object = undefined
    const property = 'a'

    sandbox.stub(esprimaParser, 'updateVariables')

    esprimaParser.handleAssignOperation(object, property, value)

    expect(
      esprimaParser.updateVariables
        .calledWithExactly(property, value)
    ).to.be.true
  })

  it('should update object given object\'s property', () => {
    const object = {a: 'old value'}
    const property = 'a'

    esprimaParser.handleAssignOperation(object, property, value)

    expect(object.a).to.be.equal('new value')
  })

  it('should update array given array\'s index', () => {
    const object = [1, 2, 3]
    const property = 1

    esprimaParser.handleAssignOperation(object, property, value)

    expect(object).to.be.eql([1, 'new value', 3])
  })
})
