describe('callDispatcher tests', () => {
  let callDispatcher, workDir

  before(() => {
    workDir = `../${global.libDir}/dispatchers/HTMLElementDispatcher/callDispatcher`
    callDispatcher = require(`${workDir}`)
  })

  it('should import all checkers in /callDispatcher/checkers', () => {
    const path = `${__dirname}/${workDir}/checkers`
    const handlers = importAllFrom(path)

    expect(callDispatcher.handlers).to.be.eql(handlers)
  })

  it('should return false when test called with data whose callee is not instanceof Callee', () => {
    const data = {
      callee: {}
    }
    const result = callDispatcher.test(data)

    expect(result).to.be.false
  })

  it('should return true when test called with data whose callee is instanceof Callee', () => {
    const Callee = require(`../${libDir}/structures/Callee`)
    const data = {
      callee: new Callee('method')
    }
    const result = callDispatcher.test(data)

    expect(result).to.be.true
  })
})
