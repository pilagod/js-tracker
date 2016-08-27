// spec: https://github.com/estree/estree/blob/master/spec.md#assignmentoperator

describe('AssignmentOperators tests', () => {
  const target = {
    object: 'object',
    property: 'property',
    info: {}
  }
  const value = 'value'
  // stub results
  const contextStub = 'contextStub'
  const statusStub = {}

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'context', contextStub)
    sandbox.stub(esprimaParser, 'checkerDispatcher', {
      dispatch: sandbox.stub().returns(statusStub)
    })
    sandbox.stub(esprimaParser, 'handleAssignManipulation')
    sandbox.stub(esprimaParser, 'handleAssignOperation')
  })

  it('should call dispatch of checkerDispatcher with an object containing context, caller (object) and callee (property)', () => {
    esprimaParser.assignmentOperators['='](target, value)

    expect(
      esprimaParser.checkerDispatcher.dispatch
        .calledWithExactly({
          caller: target.object,
          callee: target.property,
          context: esprimaParser.context
        })
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
    esprimaParser.checkerDispatcher.dispatch.returns(undefined)

    esprimaParser.assignmentOperators['='](target, value)

    expect(
      esprimaParser.handleAssignOperation
        .calledWithExactly(target.object, target.property, value)
    ).to.be.true
  })
})
