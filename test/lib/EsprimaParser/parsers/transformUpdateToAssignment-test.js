describe('transformUpdateToAssignment tests', () => {
  for (const operator of [['++', '+='], ['--', '-=']]) {
    it(`should return AssignmentExpression \'${operator[1]}\' format from UpdateExpression \'${operator[0]}\'`, () => {
      const updateExpression = createAstNode('UpdateExpression', {
        operator: operator[0],
        argument: createAstNode('Expression')
      })

      const result = esprimaParser.transformUpdateToAssignment(updateExpression)

      expect(result).to.be.eql(createAstNode('AssignmentExpression', {
        operator: operator[1],
        left: updateExpression.argument,
        right: createAstNode('Literal', {value: 1, raw: '1'})
      }))
    })
  }
})
