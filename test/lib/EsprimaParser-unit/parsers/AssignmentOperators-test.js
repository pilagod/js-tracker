// spec: https://github.com/estree/estree/blob/master/spec.md#assignmentoperator

describe('AssignmentOperators tests', () => {
  let assign
  // stub results
  const exp = {
    caller: {},
    callee: 'callee',
    info: {}
  }
  const value = 'value'
  const success = 'boolean'

  beforeEach(() => {
    assign = esprimaParser.assignmentOperators['=']

    sandbox.stub(esprimaParser, 'setCheckFlag').returns(success)
    sandbox.stub(esprimaParser, 'handleAssign')
    sandbox.stub(esprimaParser, 'resetCheckFlag')
  })

  it('should call setCheckFlag with exp', () => {
    assign(exp, value)

    expect(
      esprimaParser.setCheckFlag
        .calledWithExactly(exp)
    ).to.be.true
  })

  it('should call handleAssign with exp after setCheckFlag', () => {
    assign(exp, value)

    expect(
      esprimaParser.handleAssign
        .calledAfter(esprimaParser.setCheckFlag)
    ).to.be.true
    expect(
      esprimaParser.handleAssign
        .calledWithExactly(exp, value)
    ).to.be.true
  })

  it('should call resetCheckFlag with success (from setCheckFlag) after handleAssign', () => {
    assign(exp, value)

    expect(
      esprimaParser.resetCheckFlag
        .calledAfter(esprimaParser.handleAssign)
    ).to.be.true
    expect(
      esprimaParser.resetCheckFlag
        .calledWithExactly(success)
    ).to.be.true
  })

  it('should return value', () => {
    const result = assign(exp, value)

    expect(result).to.be.equal(value)
  })
})
