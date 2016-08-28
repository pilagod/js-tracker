describe('propDispatcher tests', () => {
  let propDispatcher, workDir

  before(() => {
    workDir = `../${libDir}/dispatchers/HTMLElementDispatcher/propDispatcher`
    propDispatcher = require(`${workDir}`)
  })

  it('should import all checkers in /callDispatcher/checkers', () => {
    const path = `${__dirname}/${workDir}/checkers`
    const handlers = importAllFrom(path)

    expect(propDispatcher.handlers).to.be.eql(handlers)
  })

  it('should return false when test called with data whose callee is not a string', () => {
    const data = {
      callee: {}
    }
    const result = propDispatcher.test(data)

    expect(result).to.be.false
  })

  it('should return true when test called with data whose callee is a string', () => {
    const data = {
      callee: 'callee'
    }
    const result = propDispatcher.test(data)

    expect(result).to.be.true
  })
})
