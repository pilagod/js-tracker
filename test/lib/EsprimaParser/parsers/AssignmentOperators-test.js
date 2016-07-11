// spec: https://github.com/estree/estree/blob/master/spec.md#assignmentoperator

describe('AssignmentOperators tests', () => {
  it('should call update of closureStack with property and value given no object reference', () => {
    const target = {
      property: 'a'
    }

    sandbox.stub(esprimaParser, 'closureStack', {
      update: sandbox.spy()
    })

    esprimaParser.assignmentOperators['='](target, 'value')

    expect(
      esprimaParser.closureStack.update
        .calledWithExactly('a', 'value')
    ).to.be.true
  })

  it('should update object given object\'s property', () => {
    const target = {
      object: {a: 'oldValue'},
      property: 'a'
    }

    esprimaParser.assignmentOperators['='](target, 'value')

    expect(target.object.a).to.be.equal('value')
  })

  it('should update array given array\'s index', () => {
    const target = {
      object: [1, 2, 3],
      property: 1
    }

    esprimaParser.assignmentOperators['='](target, 'value')

    expect(target.object).to.be.eql([1, 'value', 3])
  })
})
