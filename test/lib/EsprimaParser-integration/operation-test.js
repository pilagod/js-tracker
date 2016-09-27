describe('operation', () => {
  let closureStack

  beforeEach(() => {
    closureStack = esprimaParser.closureStack
  })

  /*************************/
  /*    Unary Operations   */
  /*************************/

  describe('unary operations tests', () => {
    it('should handle \'-\' operation', () => {
      const ast = esprima.parse(`
        var a = -1;
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.equal(-1)
    })

    it('should handle \'+\' operation', () => {
      const ast = esprima.parse(`
        var a = +1
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.equal(1)
    })

    it('should handle \'!\' operation', () => {
      const ast = esprima.parse(`
        var a = true;
        var b = !a;
        var c = !b;
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.true
      expect(closureStack.get('b')).to.be.false
      expect(closureStack.get('c')).to.be.true
    })

    it('should handle \'~\' operation', () => {
      const ast = esprima.parse(`
        var a = 4;
        var b = ~ a;
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.equal(4)
      expect(closureStack.get('b')).to.be.equal(-5)
    })

    it('should handle \'typeof\' operation', () => {
      const ast = esprima.parse(`
        var a = typeof 'string';
        var b = typeof 1;
        var c = typeof {};
        var d = typeof (function () {});
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.equal('string')
      expect(closureStack.get('b')).to.be.equal('number')
      expect(closureStack.get('c')).to.be.equal('object')
      expect(closureStack.get('d')).to.be.equal('function')
    })

    it('should handle \'void\' operation', () => {
      const ast = esprima.parse(`
        var a = void 1;
        var b = void {};
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.undefined
      expect(closureStack.get('b')).to.be.undefined
    })

    it('should handle \'delete operation\'', () => {
      const ast = esprima.parse(`
        var a = {
          'num': 1
        };
        delete a.num
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.eql({})
    })
  })

  /*************************/
  /*    Binary Operations  */
  /*************************/

  describe('binary operations tests', () => {
    it('should handle \'==\' operation', () => {
      const ast = esprima.parse(`
        var a = (0 == '0')
        var b = (0 == 1)
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.true
      expect(closureStack.get('b')).to.be.false
    })

    it('should handle \'!=\' operation', () => {
      const ast = esprima.parse(`
        var a = (0 != 1);
        var b = (0 != 0);
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.true
      expect(closureStack.get('b')).to.be.false
    })

    it('should handle \'===\' operation', () => {
      const ast = esprima.parse(`
        var a = (0 === 0);
        var b = (0 === '0');
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.true
      expect(closureStack.get('b')).to.be.false
    })

    it('should handle \'!==\' operation', () => {
      const ast = esprima.parse(`
        var a = (0 !== '0');
        var b = (0 !== 0);
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.true
      expect(closureStack.get('b')).to.be.false
    })

    it('should handle \'<\' operation', () => {
      const ast = esprima.parse(`
        var a = 1 < 2;
        var b = 1 < 0;
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.true
      expect(closureStack.get('b')).to.be.false
    })

    it('should handle \'<=\' operation', () => {
      const ast = esprima.parse(`
        var a = 1 <= 1;
        var b = 1 <= 0;
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.true
      expect(closureStack.get('b')).to.be.false
    })

    it('should handle \'>\' operation', () => {
      const ast = esprima.parse(`
        var a = 2 > 1;
        var b = 2 > 3;
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.true
      expect(closureStack.get('b')).to.be.false
    })

    it('should handle \'>=\' operation', () => {
      const ast = esprima.parse(`
        var a = 2 >= 2;
        var b = 2 >= 3;
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.true
      expect(closureStack.get('b')).to.be.false
    })

    it('should handle \'<<\' operation', () => {
      const ast = esprima.parse(`
        var a = 9 << 2;
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.equal(36)
    })

    it('should handle \'>>\' operation', () => {
      const ast = esprima.parse(`
        var a = 9 >> 2;
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.equal(2)
    })

    it('should handle \'>>>\' operation', () => {
      const ast = esprima.parse(`
        var a = -9 >>> 2;
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.equal(1073741821)
    })

    it('should handle \'+\' operation', () => {
      const ast = esprima.parse(`
        var a = 1 + 2;
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.equal(3)
    })

    it('should handle \'-\' operation', () => {
      const ast = esprima.parse(`
        var a = 1 - 2;
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.equal(-1)
    })

    it('should handle \'*\' operation', () => {
      const ast = esprima.parse(`
        var a = 2 * 4;
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.equal(8)
    })

    it('should handle \'/\' operation', () => {
      const ast = esprima.parse(`
        var a = 4 / 2;
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.equal(2)
    })

    it('should handle \'%\' operation', () => {
      const ast = esprima.parse(`
        var a = 5 % 2;
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.equal(1)
    })

    it('should handle \'|\' operation', () => {
      const ast = esprima.parse(`
        var a = 9 | 14;
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.equal(15)
    })

    it('should handle \'^\' operation', () => {
      const ast = esprima.parse(`
        var a = 9 ^ 14;
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.equal(7)
    })

    it('should handle \'&\' operation', () => {
      const ast = esprima.parse(`
        var a = 9 & 14;
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.equal(8)
    })

    it('should handle \'in\' operation', () => {
      const ast = esprima.parse(`
        var a = ('a' in {'a': 1})
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.true
    })

    it('should handle \'instanceof\' operation', () => {
      const ast = esprima.parse(`
        var a = function () {} instanceof Function;
        var b = {} instanceof Object
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.true
      expect(closureStack.get('b')).to.be.true
    })
  })

  /*************************/
  /*   Logical Operations  */
  /*************************/

  describe('logical operations tests', () => {
    it('should handle \'||\' operation', () => {
      const ast = esprima.parse(`
        var a = 0 || 1
        var b = undefined || 'string'
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.equal(1)
      expect(closureStack.get('b')).to.be.equal('string')
    })

    it('should handle \'&&\' operation', () => {
      const ast = esprima.parse(`
        var a = 'b' && 'a';
        var b = 'string' && 0;
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.equal('a')
      expect(closureStack.get('b')).to.be.equal(0)
    })
  })

  /*************************/
  /* Assignment Operations */
  /*************************/

  describe('assignment operations tests', () => {
    it('should handle \'=\' operation', () => {
      const ast = esprima.parse(`
        var a = 1;
        a = 2;

        var b = {'num': 3};
        b.num = 4;

        var c = [1, 2, 3];
        c[2] = 4;
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.equal(2)
      expect(closureStack.get('b')).to.be.eql({num: 4})
      expect(closureStack.get('c')).to.be.eql([1, 2, 4])
    })
  })

  /*************************/
  /*   Update Operations   */
  /*************************/

  describe('update operations tests', () => {
    it('should handle \'++\' operation', () => {
      const ast = esprima.parse(`
        var a = 1;
        var b = a ++;
        var c = ++ a;
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.equal(3)
      expect(closureStack.get('b')).to.be.equal(1)
      expect(closureStack.get('c')).to.be.equal(3)
    })

    it('should handle \'--\' operation', () => {
      const ast = esprima.parse(`
        var a = 1;
        var b = a --;
        var c = -- a;
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.equal(-1)
      expect(closureStack.get('b')).to.be.equal(1)
      expect(closureStack.get('a')).to.be.equal(-1)
    })

    it('should handle properly with string argument', () => {
      const ast = esprima.parse(`
        var a = "0";
        var b = ++a;
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('b')).to.be.equal(1)
    })
  })
})
