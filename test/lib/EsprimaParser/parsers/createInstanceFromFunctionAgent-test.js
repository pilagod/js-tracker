describe('createInstanceFromFunctionAgent tests', () => {
  const CalledConstructor = {}
  const initArguments = ['arg1', 'arg2', 'arg3']
  let createInstanceSkeletonStub

  beforeEach(() => {
    createInstanceSkeletonStub = {}

    sandbox.stub(esprimaParser, 'createInstanceSkeleton')
      .returns(createInstanceSkeletonStub)
    sandbox.stub(esprimaParser, 'parseFunctionAgent')
  })

  it('should call createInstanceSkeleton with CalledConstructor', () => {
    esprimaParser.createInstanceFromFunctionAgent(CalledConstructor, initArguments)

    expect(
      esprimaParser.createInstanceSkeleton
        .calledWithExactly(CalledConstructor)
    ).to.be.true
  })

  it('should set constructor of result from createInstanceSkeleton to CalledConstructor', () => {
    esprimaParser.createInstanceFromFunctionAgent(CalledConstructor, initArguments)

    expect(createInstanceSkeletonStub.constructor).to.be.equal(CalledConstructor)
  })

  it('should call parseFunction with CustomConstructor, resultFromCreateInstanceSkeleton (as context) and initArguments', () => {
    esprimaParser.createInstanceFromFunctionAgent(CalledConstructor, initArguments)

    expect(
      esprimaParser.parseFunctionAgent
        .calledWithExactly(
          CalledConstructor,
          createInstanceSkeletonStub,
          initArguments
        )
    ).to.be.true
  })

  it('should return result from createInstanceSkeleton', () => {
    const result = esprimaParser.createInstanceFromFunctionAgent(CalledConstructor, initArguments)

    expect(result).to.be.equal(createInstanceSkeletonStub)
  })
})
