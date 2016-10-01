describe('filterSubStatements tests', () => {
  let statement

  describe('BlockStatement', () => {
    beforeEach(() => {
      statement = createAstNode('BlockStatement', {
        body: [
          createAstNode('Statement1'),
          createAstNode('Statement2'),
          createAstNode('Statement3'),
        ]
      })
    })

    it('should return its body', () => {
      const result = esprimaParser.filterSubStatements(statement)

      expect(result).to.be.eql(statement.body)
    })
  })

  describe('IfStatement', () => {
    beforeEach(() => {
      statement = createAstNode('IfStatement', {
        consequent: createAstNode('StatementConsequent'),
        alternate: createAstNode('StatementAlternate')
      })
    })

    it('should return an array concating its consequent and alternate', () => {
      const result = esprimaParser.filterSubStatements(statement)

      expect(result).to.be.eql([
        statement.consequent,
        statement.alternate
      ])
    })
  })

  describe('SwitchStatement', () => {
    beforeEach(() => {
      statement = createAstNode('SwitchStatement', {
        cases: [
          createAstNode('SwitchCase', {consequent: [createAstNode('Statement1')]}),
          createAstNode('SwitchCase', {consequent: [createAstNode('Statement2')]}),
          createAstNode('SwitchCase', {consequent: [createAstNode('Statement3')]})
        ]
      })
    })

    it('should return an array concating all cases.consequent', () => {
      const result = esprimaParser.filterSubStatements(statement)

      expect(result).to.be.eql([
        createAstNode('Statement1'),
        createAstNode('Statement2'),
        createAstNode('Statement3')
      ])
    })
  })

  describe('TryStatement', () => {
    beforeEach(() => {
      statement = createAstNode('TryStatement', {
        block: createAstNode('BlockStatementTry'),
        finalizer: createAstNode('BlockStatementFinal')
      })
    })

    it('should return an array concating its block, handler.body (given handler non-null) and finalizer', () => {
      statement.handler = createAstNode('CatchClause', {
        body: createAstNode('BlockStatementCatch')
      })
      const result = esprimaParser.filterSubStatements(statement)

      expect(result).to.be.eql([
        statement.block,
        statement.handler.body,
        statement.finalizer
      ])
    })

    it('should return an array concating its block, handler (given handler null) and finalizer', () => {
      statement.handler = null

      const result = esprimaParser.filterSubStatements(statement)

      expect(result).to.be.eql([
        statement.block,
        statement.handler,
        statement.finalizer
      ])
    })
  })

  describe('ForStatement', () => {
    beforeEach(() => {
      statement = createAstNode('ForStatement', {
        init: createAstNode('VariableDeclaration'),
        body: createAstNode('Statement')
      })
    })

    it('should return an array concating its init and body', () => {
      const result = esprimaParser.filterSubStatements(statement)

      expect(result).to.be.eql([
        statement.init,
        statement.body
      ])
    })
  })

  describe('ForInStatement', () => {
    beforeEach(() => {
      statement = createAstNode('ForInStatement', {
        left: createAstNode('VariableDeclaration'),
        body: createAstNode('Statement')
      })
    })

    it('should return an array concating its left and body', () => {
      const result = esprimaParser.filterSubStatements(statement)

      expect(result).to.be.eql([
        statement.left,
        statement.body
      ])
    })
  })

  for (const type of ['WhileStatement', 'DoWhileStatement']) {
    describe(`${type}`, () => {
      beforeEach(() => {
        statement = createAstNode(type, {
          body: createAstNode('Statement')
        })
      })

      it('should return an array concating its body', () => {
        const result = esprimaParser.filterSubStatements(statement)

        expect(result).to.be.eql([
          statement.body
        ])
      })
    })
  }

  describe('Other', () => {
    beforeEach(() => {
      statement = createAstNode('OtherStatementOrExpression')
    })

    it('should return empty array', () => {
      const result = esprimaParser.filterSubStatements(statement)

      expect(result).to.be.eql([])
    })
  })
})
