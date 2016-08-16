// spec: https://github.com/estree/estree/blob/master/spec.md#assignmentoperator

describe('AssignmentOperators tests', () => {
  const target = {
    object: 'object',
    property: 'property',
    info: {
      code: 'code',
      loc: 'loc'
    }
  }
  const value = 'value'
  const statusStub = {
    type: 'STATE'
  }
  beforeEach(() => {
    sandbox.stub(esprimaParser, 'callChecker', {
      dispatch: sandbox.stub().returns(statusStub)
    })
    sandbox.stub(esprimaParser, 'handleAssignManipulation')
    sandbox.stub(esprimaParser, 'handleAssignOperation')
  })

  it('should call dispatch of callChecker with object and property', () => {
    esprimaParser.assignmentOperators['='](target, value)

    expect(
      esprimaParser.callChecker.dispatch
        .calledWithExactly(target.object, target.property)
    ).to.be.true
  })

  it('should call handleAssignManipulation with object, property, status and info given non-undefined status', () => {
    esprimaParser.assignmentOperators['='](target, value)

    expect(
      esprimaParser.handleAssignManipulation
        .calledWithExactly(target.object, target.property, target.info, value, statusStub)
    ).to.be.true
  })

  it('should call handleAssignOperation with object, property and value given undefined status', () => {
    esprimaParser.callChecker.dispatch.returns(undefined)

    esprimaParser.assignmentOperators['='](target, value)

    expect(
      esprimaParser.handleAssignOperation
        .calledWithExactly(target.object, target.property, value)
    ).to.be.true
  })
})
