// spec: https://github.com/estree/estree/blob/master/spec.md#assignmentoperator

describe('AssignmentOperators tests', () => {
  const target = {
    caller: {},
    callee: {},
    info: {}
  }
  const value = 'value'
  // stub results
  const context = {}
  const status = {}

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'context', context)
    sandbox.stub(esprimaParser, 'checkerDispatcher', {
      dispatch: sandbox.stub().returns(status)
    })
    sandbox.stub(esprimaParser, 'handleAssignment')
  })

  it('should call dispatch of checkerDispatcher with an object containing context and {caller, callee, info}', () => {
    esprimaParser.assignmentOperators['='](target, value)

    expect(
      esprimaParser.checkerDispatcher.dispatch
        .calledWithExactly(Object.assign({context}, target))
    ).to.be.true
  })

  it('should call handleAssigment with target, value and status', () => {
    esprimaParser.assignmentOperators['='](target, value)

    expect(
      esprimaParser.handleAssignment
        .calledWithExactly(target, value, status)
    ).to.be.true
  })
})
