describe('setUpdateValue tests', () => {
  const update = 1
  const exp = {
    caller: undefined,
    callee: 'callee'
  }
  let argument

  beforeEach(() => {
    argument = createAstNode('Expression')

    sandbox.stub(esprimaParser, 'getRefExp').returns(exp)
    sandbox.stub(esprimaParser, 'assignmentOperators', {
      '=': sandbox.spy()
    })
  })

  it('should call getRefExp with argument', () => {
    esprimaParser.setUpdateValue(argument, update)

    expect(
      esprimaParser.getRefExp
        .calledWithExactly(argument)
    ).to.be.true
  })

  it('should call \'=\' of assignmentOperators with exp and update', () => {
    esprimaParser.setUpdateValue(argument, update)

    expect(
      esprimaParser.assignmentOperators['=']
        .calledWithExactly(exp, update)
    ).to.be.true
  })
})
