// spec: https://github.com/estree/estree/blob/master/spec.md#assignmentoperator

describe('AssignmentOperators tests', () => {
  it('should call updateVariables with property and value given no object reference', () => {
    const value = 'value'
    const target = {
      property: 'a'
    }

    sandbox.stub(esprimaParser, 'updateVariables')

    esprimaParser.assignmentOperators['='](target, value)

    expect(
      esprimaParser.updateVariables
        .calledWithExactly(target.property, value)
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
