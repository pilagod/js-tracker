describe('Nested of collection', () => {
  const scriptUrl = 'scriptUrl'
  let M, E, closureStack, collection

  before(() => {
    M = esprimaParser.Collection.MANIPULATION
    E = esprimaParser.Collection.EVENT
  })

  beforeEach(() => {
    closureStack = esprimaParser.closureStack
    collection = esprimaParser.collection
  })

  const HTMLElementStub = function () {
    this.classList = {}
    this.dataset = {}
  }

  describe('jQuery', () => {
    let $element, elements

    const jQueryStub = function () {
      if (!(this instanceof jQueryStub)) {
        return $element
      }
      this.elements = elements

      return this
    }

    jQueryStub.prototype.get = function () {
      return this.elements
    }

    before(() => {
      esprimaParser.context.jQuery = jQueryStub
    })

    beforeEach(() => {
      elements = [
        new HTMLElementStub(),
        new HTMLElementStub()
      ]
      $element = new jQueryStub(elements)
    })

    it('should not add nested manipulation to collection', () => {
      $element.addClass = function (className) {
        for (const element of elements) {
          element.classList.add(className)
        }
      }
      for (const element of elements) {
        element.classList.add = sandbox.spy()
      }
      const ast = esprima.parse(`
        var $element = jQuery('#element');

        $element.addClass('class');
      `, {loc: true})

      esprimaParser.parseAst(ast, scriptUrl)

      for (const index of [0, 1]) {
        const group = collection.data[index + 1][M][scriptUrl]

        expect(elements[index].dataset).to.have.property('collectionId', index + 1)
        expect(
          elements[index].classList.add
            .calledWithExactly('class')
        ).to.be.true
        expect(Object.keys(group)).to.have.lengthOf(1)
        expect(group).to.have.property('[4:8]-[4:34]', '$element.addClass(\'class\')')
      }
    })

    it('should not add nested event to collection', () => {
      $element.on = function (eventType, handler) {
        for (const element of elements) {
          element.addEventListener(eventType, handler)
        }
      }
      for (const element of elements) {
        element.addEventListener = sandbox.spy()
      }
      const ast = esprima.parse(`
        var $element = jQuery('#element');
        var clickHandler = function () {};

        $element.on('click', clickHandler);
      `, {loc: true})

      esprimaParser.parseAst(ast, scriptUrl)

      const clickHandler = closureStack.get('clickHandler')

      for (const index of [0, 1]) {
        const group = collection.data[index + 1][E][scriptUrl]

        expect(elements[index].dataset).to.have.property('collectionId', index + 1)
        expect(
          elements[index].addEventListener
            .calledWithExactly('click', clickHandler)
        ).to.be.true
        expect(Object.keys(group)).to.have.lengthOf(1)
        expect(group).to.have.property('[5:8]-[5:42]', '$element.on(\'click\', clickHandler)')
      }
    })
  })
})
