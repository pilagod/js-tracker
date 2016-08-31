const proxyquire = require('proxyquire')

for (const DISPATCHER of global.DISPATCHERS) {
  for (const calleeType of ['Call', 'Prop']) {
    if (DISPATCHER[calleeType]) {
      const callerType = DISPATCHER.type

      describe(`${callerType} ${calleeType}Dispatcher tests`, () => {
        let workDir, checkerDir, createDispatcherStub, dispatcher

        before(() => {
          workDir = `${libDir}/dispatchers/${callerType}Dispatcher/${calleeType}Dispatcher`
          checkerDir = `${libDir}/checkers/${callerType}/${calleeType}`
        })

        beforeEach(() => {
          createDispatcherStub = sandbox.stub()
            .withArgs({path: sinon.match.string})
              .returns(`resultFromCreate${calleeType}Dispatcher`)
          dispatcher = proxyquire(workDir, {
            [`../create${calleeType}Dispatcher`]: createDispatcherStub
          })
        })

        it('should call create${calleeType}Dispatcher once with an object whose path is a string', () => {
          const info = createDispatcherStub.args[0][0]

          expect(createDispatcherStub.calledOnce).to.be.true
          expect(info).to.have.property('path')
          expect(info.path).to.be.a('string')
        })

        it(`should call create${calleeType}Dispatcher with an object whose path points to /checkers/${callerType}/${calleeType}`, () => {
          const info = createDispatcherStub.args[0][0]
          // it's not easily to test two different absolute paths equal, instead,
          // import modules from these two paths and check if importing results equal
          const handlers = importAllFrom(info.path)
          const expectedHandlers = importAllFrom(`${__dirname}/${checkerDir}`)

          expect(handlers).to.be.eql(expectedHandlers)
        })

        it('should export result from create${calleeType}Dispatcher', () => {
          expect(dispatcher).to.be.equal(`resultFromCreate${calleeType}Dispatcher`)
        })
      })
    }
  }
}
