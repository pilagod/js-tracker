const proxyquire = require('proxyquire')

for (const DISPATCHER of global.DISPATCHERS) {
  if (DISPATCHER.prop) {
    const type = DISPATCHER.type

    describe(`${type} propDispatcher tests`, () => {
      let propDispatcher, createPropDispatcherStub, workDir

      before(() => {
        workDir = `${libDir}/dispatchers/${type}Dispatcher/propDispatcher`
      })

      beforeEach(() => {
        createPropDispatcherStub = sandbox.stub()
          .withArgs({path: sinon.match.string})
            .returns('resultFromCreatePropDispatcher')
        propDispatcher = proxyquire(workDir, {
          '../../createPropDispatcher': createPropDispatcherStub
        })
      })

      it('should call createPropDispatcher once with an object whose path is a string', () => {
        const info = createPropDispatcherStub.args[0][0]

        expect(createPropDispatcherStub.calledOnce).to.be.true
        expect(info).to.have.property('path')
        expect(info.path).to.be.a('string')
      })

      it(`should call createPropDispatcher with an object whose path points to ${type}Dispatcher/callDispatcher/checkers`, () => {
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
  }
}
