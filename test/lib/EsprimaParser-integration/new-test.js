// Standard built-in objects https://goo.gl/jvqc2d

describe('new tests', () => {
  let closureStack

  beforeEach(() => {
    closureStack = esprimaParser.closureStack
  })

  /*************************/
  /*     basic instance    */
  /*************************/

  describe('basic instance', () => {
    it('should handle Array instance', () => {
      const ast = esprima.parse(`
        var a = new Array(1, 2, 3);
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.instanceof(Array)
      expect(closureStack.get('a')).to.be.eql([1, 2, 3])
    })

    it('should handle Boolean instance', () => {
      const ast = esprima.parse(`
        var a = new Boolean(true);
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.instanceof(Boolean)
      expect(closureStack.get('a').valueOf()).to.be.true
    })

    it('should handle Error instance', () => {
      const ast = esprima.parse(`
        var a = new Error('error');
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.instanceof(Error)
      expect(closureStack.get('a').message).to.be.equal('error')
    })

    it('should handle Number instance', () => {
      const ast = esprima.parse(`
        var a = new Number(1);
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.instanceof(Number)
      expect(closureStack.get('a').valueOf()).to.be.equal(1)
    })

    it('should handle Object instance', () => {
      const ast = esprima.parse(`
        var a = new Object(undefined);
        var b = new Object(true);
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.instanceof(Object)
      expect(closureStack.get('a')).to.be.eql({})
      expect(closureStack.get('b')).to.be.instanceof(Boolean)
      expect(closureStack.get('b').valueOf()).to.be.true
    })

    it('should handle RegExp instance', () => {
      const ast = esprima.parse(`
        var a = /test/i;
        var b = new RegExp(/test/, 'i');
        var s = 'TEST';

        var result1 = a.test(s);
        var result2 = b.test(s);
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('result1')).to.be.true
      expect(closureStack.get('result2')).to.be.true
    })

    it('should handle String instance', () => {
      const ast = esprima.parse(`
        var a = new String('string');
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.instanceof(String)
      expect(closureStack.get('a').valueOf()).to.be.equal('string')
    })
  })

  /*************************/
  /*    custom instance    */
  /*************************/

  describe('custom instance', () => {
    it('should execute construtor properly', () => {
      const ast = esprima.parse(`
        var Instance = function (data) {
          this.data = data;
        };
        var a = new Instance({});
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.instanceof(closureStack.get('Instance'))
      expect(closureStack.get('a').data).to.be.eql({})
    })

    it('should set prototype properly', () => {
      const ast = esprima.parse(`
        var Instance = function (data) {
          this.data = data;
        };

        Instance.prototype.getData = function () {
          return this.data;
        };

        var a = new Instance({a: 1});
        var b = new Instance({b: 2});

        var data1 = a.getData();
        var data2 = b.getData();
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('data1')).to.have.property('a').and.be.equal(1)
      expect(closureStack.get('data2')).to.have.property('b').and.be.equal(2)
    })

    it('should handle inherit properly', () => {
      const ast = esprima.parse(`
        var Instance1 = function (data) {
          this.data = data
        }

        Instance1.prototype.getData = function () {
          return this.data
        }

        var Instance2 = function (data) {
          Instance1.call(this, data)
        }

        Instance2.prototype = Object.create(Instance1.prototype)
        Instance2.prototype.construtor = Instance2

        var a = new Instance2({a: 1})
        var data = a.getData()
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.instanceof(closureStack.get('Instance1'))
      expect(closureStack.get('a')).to.be.instanceof(closureStack.get('Instance2'))
      expect(closureStack.get('data')).to.be.eql({a: 1})
    })
  })
})
