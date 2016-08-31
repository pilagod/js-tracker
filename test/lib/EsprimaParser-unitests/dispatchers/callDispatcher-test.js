const proxyquire = require('proxyquire')

for (const DISPATCHER of global.DISPATCHERS) {
  if (DISPATCHER.call) {
    const type = DISPATCHER.type

    describe(`${type} callDispatcher tests`, () => {
      let callDispatcher, createCallDispatcherStub, workDir

      before(() => {
        workDir = `${libDir}/dispatchers/${type}Dispatcher/callDispatcher`
      })

      beforeEach(() => {
        createCallDispatcherStub = sandbox.stub()
          .withArgs({path: sinon.match.string})
            .returns('resultFromCreateCallDispatcher')
        callDispatcher = proxyquire(workDir, {
          '../../createCallDispatcher': createCallDispatcherStub
        })
      })

      it('should call createCallDispatcher once with an object whose path is a string', () => {
        const info = createCallDispatcherStub.args[0][0]

        expect(createCallDispatcherStub.calledOnce).to.be.true
        expect(info).to.have.property('path')
        expect(info.path).to.be.a('string')
      })

      it(`should call createCallDispatcher with an object whose path points to ${type}Dispatcher/callDispatcher/checkers`, () => {
        const info = createCallDispatcherStub.args[0][0]
        // it's not easily to test two different absolute paths equal, instead,
        // import modules from these two paths and check if importing results equal
        const handlers = importAllFrom(info.path)
        const expectedHandlers = importAllFrom(`${__dirname}/${workDir}/checkers`)

        expect(handlers).to.be.eql(expectedHandlers)
      })

      it('should export result from createCallDispatcher', () => {
        expect(callDispatcher).to.be.equal('resultFromCreateCallDispatcher')
      })
    })
  }
}
