// spec: https://github.com/estree/estree/blob/master/spec.md#whilestatement

describe('WhileStatement tests', () => {
  let whileStatement

  beforeEach(() => {
    whileStatement = createAstNode('WhileStatement', {
      test: createAstNode('Expression'),
      body: createAstNode('Statement')
    })
  })

  it('should call parseNode with test', () => {
  })
})
