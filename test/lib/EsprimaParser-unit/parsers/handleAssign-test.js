describe('handleAssign tests', () => {
  const value = 'new value'

  it('should call updateVariables with callee and value given no caller reference', () => {
    const caller = undefined
    const callee = 'a'

    sandbox.stub(esprimaParser, 'updateVariables')

    esprimaParser.handleAssign({caller, callee}, value)

    expect(
      esprimaParser.updateVariables
        .calledWithExactly(callee, value)
    ).to.be.true
  })

  it('should update object caller given caller\'s property callee', () => {
    const caller = {a: 'old value'}
    const callee = 'a'

    esprimaParser.handleAssign({caller, callee}, value)

    expect(caller.a).to.be.equal('new value')
  })

  it('should update array caller given array\'s index callee', () => {
    const caller = [1, 2, 3]
    const callee = 1

    esprimaParser.handleAssign({caller, callee}, value)

    expect(caller).to.be.eql([1, 'new value', 3])
  })
})
