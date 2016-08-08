describe('createInstanceSkeleton test', () => {
  const CalledConstructor = {
    prototype: {}
  }
  CalledConstructor.prototype.constructor = CalledConstructor

  let createNewConstructorStub

  beforeEach(() => {
    createNewConstructorStub = function () {}

    sandbox.stub(esprimaParser, 'createNewConstructor')
      .returns(createNewConstructorStub)
  })

  it('should call createNewConstructor', () => {
    esprimaParser.createInstanceSkeleton(CalledConstructor)

    expect(
      esprimaParser.createNewConstructor
        .calledWithExactly()
    ).to.be.true
  })

  it('should set prototype of result from createNewConstructor to a copy of CustomConstructor.prototype', () => {
    esprimaParser.createInstanceSkeleton(CalledConstructor)

    expect(createNewConstructorStub.prototype).to.be.eql(CalledConstructor.prototype)
  })

  it('should reuturn an instance from the result of createNewConstructor', () => {
    const result = esprimaParser.createInstanceSkeleton(CalledConstructor)

    expect(result).to.be.instanceof(createNewConstructorStub)
  })
})
