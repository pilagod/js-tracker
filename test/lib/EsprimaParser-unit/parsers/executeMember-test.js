describe('executeMember tests', () => {
  it('should return cur given undefined pre', () => {
    const pre = undefined
    const cur = 'cur'

    const result = esprimaParser.executeMember(pre, cur)

    expect(result).to.be.equal(cur)
  })

  it('should return pre[cur] given valid pre', () => {
    const pre = {
      cur: 'cur in pre'
    }
    const cur = 'cur'

    const result = esprimaParser.executeMember(pre, cur)

    expect(result).to.be.equal(pre.cur)
  })
})
