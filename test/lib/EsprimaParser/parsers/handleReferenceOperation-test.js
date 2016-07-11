describe('handleReferenceOperation tests', () => {
  let argument, operationSpy

  beforeEach(() => {
    operationSpy = sandbox.spy(() => 'resultFromOperation')
  })

  describe('Identifier argument tests', () => {
    beforeEach(() => {
      argument = createAstNode('Identifier', {name: 'a'})
    })

    it('should ')
  })

  describe('MemberExpression and CallExpression argument tests', () => {
  })

  describe('Other argument tests', () => {
  })
})
