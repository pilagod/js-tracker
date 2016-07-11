// spec: https://github.com/estree/estree/blob/master/spec.md#assignmentoperator

describe('AssignmentOperators tests', () => {
  let target

  beforeEach(() => {
    target = {
      property: 'a'
    }
  })

  it('should call update of closureStack with property and value given no object reference', () => {
    sandbox.stub(esprimaParser, 'closureStack', {
      update: sandbox.spy()
    })

    esprimaParser.assignmentOperators['='](target, 'value')

    expect(
      esprimaParser.closureStack.update
        .calledWithExactly('a', 'value')
    ).to.be.true
  })

  it('should update given object\'s property to given value', () => {
    target.object = {a: 'oldValue'}

    esprimaParser.assignmentOperators['='](target, 'value')

    expect(target.object.a).to.be.equal('value')
  })
})
