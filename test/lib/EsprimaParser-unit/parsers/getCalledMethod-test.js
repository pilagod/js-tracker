describe('getCalledMethod tests', () => {
  it('should return callee.method given caller is undefined', () => {
    const caller = undefined
    const callee = {
      method: 'method'
    }
    const result = esprimaParser.getCalledMethod({caller, callee})

    expect(result).to.be.equal(callee.method)
  })

  it('should return caller[callee.method] given valid caller', () => {
    const caller = {
      method: function () {}
    }
    const callee = {
      method: 'method'
    }
    const result = esprimaParser.getCalledMethod({caller, callee})

    expect(result).to.be.equal(caller[callee.method])
  })
})
