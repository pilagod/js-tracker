describe('label tests', () => {
  let closureStack

  beforeEach(() => {
    closureStack = esprimaParser.closureStack
  })

  it('should handle continue label', () => {
    const ast = esprima.parse(`
      var i, j;
      var result = [];

      loop1:
      for (i = 0; i < 3; i++) {
        loop2:
        for (j = 0; j < 3; j++) {
          if (i === 1 && j === 1) {
            continue loop1;
          }
          result.push({i: i, j: j})
        }
      }
    `)
    esprimaParser.parseAst(ast)

    expect(closureStack.get('result')).to.be.eql([
      {i: 0, j: 0},
      {i: 0, j: 1},
      {i: 0, j: 2},
      {i: 1, j: 0},
      {i: 2, j: 0},
      {i: 2, j: 1},
      {i: 2, j: 2},
    ])
  })

  it('should handle break label', () => {
    const ast = esprima.parse(`
      var i, j;
      var result = [];

      loop1:
      for (i = 0; i < 3; i++) {      //The first for statement is labeled "loop1"
        loop2:
        for (j = 0; j < 3; j++) {   //The second for statement is labeled "loop2"
          if (i === 1 && j === 1) {
            break loop1;
          }
          result.push({i: i, j: j})
        }
      }
    `)
    esprimaParser.parseAst(ast)

    expect(closureStack.get('result')).to.be.eql([
      {i: 0, j: 0},
      {i: 0, j: 1},
      {i: 0, j: 2},
      {i: 1, j: 0},
    ])
  })

  it('should handle label for block', () => {
    const ast = esprima.parse(`
      var result;

      block: {
        for (var i = 0; i < 10; i += 1) {
          result = i;

          if (i === 2) {
            break block;
          }
        }
      }
    `)
    esprimaParser.parseAst(ast)

    expect(closureStack.get('result')).to.be.equal(2)
  })

  it('should handle label for if', () => {
    const ast = esprima.parse(`
      var result;

      block:
      if (true) {
        result = 1;
        break block;
        result = 2;
      }
    `)
    esprimaParser.parseAst(ast)

    expect(closureStack.get('result')).to.be.equal(1)
  })
})
