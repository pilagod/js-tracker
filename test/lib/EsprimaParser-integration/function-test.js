describe('function', () => {
  let closureStack

  beforeEach(() => {
    closureStack = esprimaParser.closureStack
  })

  describe('closure tests', () => {
    it('should keep current closureStack', () => {
      resetVariables('a')

      const ast = esprima.parse(`
        var test = function () {
          return a;
        };
        var result1 = test();

        var a = 2;
        var result2 = test();

        a = 3;
        var result3 = test();
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('result1')).to.be.undefined
      expect(closureStack.get('result2')).to.be.equal(2)
      expect(closureStack.get('result3')).to.be.equal(3)
    })

    it('should create a new closure in function', () => {
      resetVariables('a')

      const ast = esprima.parse(`
        var a = 1;

        var test = function () {
          var a = 2;

          return a;
        };
        var result = test()
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('a')).to.be.equal(1)
      expect(closureStack.get('result')).to.be.equal(2)
    })
  })

  describe('bind tests', () => {
    it('should bind context properly (1)', () => {
      const ast = esprima.parse(`
        this.a = 9;

        var test = {
          a: 81,
          getA: function () {
            return this.a;
          }
        };
        var result1 = test.getA();

        var getA = test.getA;
        var result2 = getA();

        var boundGetA = getA.bind(test);
        var result3 = boundGetA();
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('result1')).to.be.equal(81)
      expect(closureStack.get('result2')).to.be.equal(9)
      expect(closureStack.get('result3')).to.be.equal(81)
    })

    it('should bind context properly (2)', () => {
      const ast = esprima.parse(`
        var list = function () {
          return Array.prototype.slice.call(arguments)
        }
        var list1 = list(1, 2, 3);
        var leadingThirtysevenList = list.bind(undefined, 37);
        var list2 = leadingThirtysevenList();
        var list3 = leadingThirtysevenList(1, 2, 3);
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('list1')).to.be.eql([1, 2, 3])
      expect(closureStack.get('list2')).to.be.eql([37])
      expect(closureStack.get('list3')).to.be.eql([37, 1, 2, 3])
    })
  })

  describe('call tests', () => {
    it('should call context and arugments properly (1)', () => {
      const ast = esprima.parse(`
        function Product(name, price) {
          this.name = name;
          this.price = price;
        }

        function Food(name, price) {
          Product.call(this, name, price);
          this.category = 'food';
        }

        function Toy(name, price) {
          Product.call(this, name, price);
          this.category = 'toy';
        }

        var cheese = new Food('feta', 5);
        var fun = new Toy('robot', 40);
      `)
      esprimaParser.parseAst(ast)

      const cheese = closureStack.get('cheese')
      const fun = closureStack.get('fun')

      expect(cheese).to.have.property('name', 'feta')
      expect(cheese).to.have.property('price', 5)
      expect(cheese).to.have.property('category', 'food')

      expect(fun).to.have.property('name', 'robot')
      expect(fun).to.have.property('price', 40)
      expect(fun).to.have.property('category', 'toy')
    })

    it('should call context and arguments properly (2)', () => {
      const ast = esprima.parse(`
        var results = []
        var animals = [
          { species: 'Lion', name: 'King' },
          { species: 'Whale', name: 'Fail' }
        ];
        for (var i = 0; i < animals.length; i++) {
          (function(i) {
            results.push(
              '#' + i +
              ' ' + this.species +
              ': ' + this.name
            )
          }).call(animals[i], i);
        }
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('results')).to.be.eql([
        '#0 Lion: King',
        '#1 Whale: Fail'
      ])
    })

    it('should call context and arguments properly (3)', () => {
      const ast = esprima.parse(`
        function greet() {
          return [this.person, 'Is An Awesome', this.role].join(' ');
        }
        var i = {
          person: 'Douglas Crockford',
          role: 'Javascript Developer'
        };
        var result = greet.call(i);
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('result')).to.be.equal('Douglas Crockford Is An Awesome Javascript Developer')
    })
  })

  describe('apply tests', () => {
    it('should apply context and arguments properly (1)', () => {
      const ast = esprima.parse(`
        var numbers = [5, 6, 2, 3, 7];
        var max = Math.max.apply(null, numbers);
        var min = Math.min.apply(null, numbers);
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('max')).to.be.equal(7)
      expect(closureStack.get('min')).to.be.equal(2)
    })

    it('should apply context and arguments properly (2)', () => {
      const ast = esprima.parse(`
        function test(a, b, c) {
          this.result = a + b + c
        }
        test.apply(null, [1, 2, 3])
      `)
      esprimaParser.parseAst(ast)

      expect(closureStack.get('result')).to.be.equal(6)
    })
  })

  describe.only('callback', () => {
    describe('forEach tests', () => {
      it('should execute properly (1)', () => {
        const ast = esprima.parse(`
          var results = []

          function logArrayElements(element, index, array) {
            results.push('a[' + index + '] = ' + element);
          }
          [2, 5, , 9].forEach(logArrayElements)
        `)
        esprimaParser.parseAst(ast)
        
        expect(closureStack.get('results')).to.be.eql([
          'a[0] = 2',
          'a[1] = 5',
          'a[3] = 9'
        ])
      })
    })
  })
})
