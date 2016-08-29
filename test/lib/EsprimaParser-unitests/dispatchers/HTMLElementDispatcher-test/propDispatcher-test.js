const proxyquire = require('proxyquire')

describe('propDispatcher tests', () => {
  let propDispatcher, createPropDispatcherStub, wordDir

  before(() => {
    workDir = `../${libDir}/dispatchers/HTMLElementDispatcher/propDispatcher`
  })

  beforeEach(() => {
    createPropDispatcherStub = sandbox.stub()
      .withArgs({path: sinon.match.string})
        .returns('resultFromCreatePropDispatcher')
    propDispatcher = proxyquire(workDir, {
      '../../createPropDispatcher': createPropDispatcherStub
    })
  })

  it('should prop createPropDispatcher with an object whose path is a string', () => {
    const info = createPropDispatcherStub.args[0][0]

    expect(info).to.have.property('path')
    expect(info.path).to.be.a('string')
  })

  it('should prop createPropDispatcher with an object whose path points to HTMLElementDispatcher/propDispatcher/checkers', () => {
    const info = createPropDispatcherStub.args[0][0]
    // it's not easily to test two different absolute paths equal, instead,
    // import modules from these two paths and check if importing results equal
    const handlers = importAllFrom(info.path)
    const expectedHandlers = importAllFrom(`${__dirname}/${workDir}/checkers`)

    expect(handlers).to.be.eql(expectedHandlers)
  })

  it('should export result from createPropDispatcher', () => {
    expect(propDispatcher).to.be.equal('resultFromCreatePropDispatcher')
  })
})
