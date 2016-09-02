// spec: https://github.com/estree/estree/blob/master/spec.md#emptystatement

describe('EmptyStatement tests', () => {
  it('should return undefined', () => {
    const result = esprimaParser.EmptyStatement()

    expect(result).to.be.undefined
  })
})
