describe('getMethod tests', () => {
  it('should return cur.method given pre undefined', () => {
    const pre = undefined
    const cur = {
      method: 'method'
    }

    const result = esprimaParser.getMethod(pre, cur)

    expect(result).to.be.equal(cur.method)
  })

  it('should return pre[cur.method] given valid pre', () => {
    const pre = {
      method: 'method in pre'
    }
    const cur = {
      method: 'method'
    }

    const result = esprimaParser.getMethod(pre, cur)

    expect(result).to.be.equal(pre[cur.method])
  })
})
