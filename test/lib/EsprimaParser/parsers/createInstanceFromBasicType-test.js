describe('createInstanceFromBasicType tests', () => {
  it('should return new instance of CustomConstructor with desctructed initArguments', () => {
    const initArguments = ['arg1', 'arg2', 'arg3']
    const CustomConstructor = function (...passedInitArguments) {
      expect(passedInitArguments).to.be.eql(initArguments)
    }

    const result = esprimaParser.createInstanceFromBasicType(
      CustomConstructor,
      initArguments
    )

    expect(result).to.be.instanceof(CustomConstructor)
  })
})
