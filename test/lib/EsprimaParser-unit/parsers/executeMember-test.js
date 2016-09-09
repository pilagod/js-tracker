describe('executeMember tests', () => {
  it('should return caller[callee]', () => {
    const caller = {
      callee: 'value'
    }
    const callee = 'callee'

    const result = esprimaParser.executeMember({caller, callee})

    expect(result).to.be.equal(caller[callee])
  })
})
