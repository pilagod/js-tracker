describe('handleAssignment tests', () => {
  const target = {
    caller: {},
    callee: {}
  }
  const value = 'value'

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'handleAssignManipulation')
    sandbox.stub(esprimaParser, 'handleAssignOperation')
  })

  it('should call handleAssignManipulation with target, value and status given valid status', () => {
    const status = {}

    esprimaParser.handleAssignment(target, value, status)

    expect(
      esprimaParser.handleAssignManipulation
        .calledWithExactly(target, value, status)
    ).to.be.true
  })

  it('should call handleAssignOperation with target and value given non-valid status', () => {
    const status = undefined

    esprimaParser.handleAssignment(target, value, status)

    expect(
      esprimaParser.handleAssignOperation
        .calledWithExactly(target, value)
    ).to.be.true
  })
})
