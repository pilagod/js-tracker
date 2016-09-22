const proxyquire = require('proxyquire')

for (const DISPATCHER of global.DISPATCHERS) {
  for (const calleeType of ['Call', 'Prop']) {
    if (DISPATCHER[calleeType]) {
      const callerType = DISPATCHER.type

      describe(`${callerType} ${calleeType.toLowerCase()}Dispatcher tests`, () => {
        let workDir, checkerDir, createDispatcherStub, dispatcher

        before(() => {
          workDir = `${libDir}/dispatchers/${callerType}Dispatcher/${calleeType.toLowerCase()}Dispatcher`
          checkerDir = `${libDir}/checkers/${callerType}/${calleeType.toLowerCase()}`
        })

        beforeEach(() => {
          createDispatcherStub = sandbox.stub()
            .withArgs(sinon.match.array)
              .returns(`resultFromCreate${calleeType}Dispatcher`)
          dispatcher = proxyquire(workDir, {
            [`../create${calleeType}Dispatcher`]: createDispatcherStub
          })
        })

        it(`should call create${calleeType}Dispatcher once with an array of handlers`, () => {
          const handlers = createDispatcherStub.args[0][0]

          expect(createDispatcherStub.calledOnce).to.be.true
          expect(handlers).to.be.an('array')
        })

        it(`should call create${calleeType}Dispatcher with an array containing all checkers in /checkers/${callerType}/${calleeType}`, () => {
          const handlers = createDispatcherStub.args[0][0]
          // it's not easily to test two different absolute paths equal, instead,
          // import modules from these two paths and check if importing results equal
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
