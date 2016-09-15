describe('EVENT of collection', () => {
  const scriptUrl = 'scriptUrl'
  let E, closureStack, collection

  before(() => {
    E = esprimaParser.Collection.EVENT
  })

  beforeEach(() => {
    closureStack = esprimaParser.closureStack
    collection = esprimaParser.collection
  })

  const checkEmptyCollection = (elements) => {
    const arr = [].concat(elements)

    for (const element of arr) {
      expect(element.dataset).to.not.have.property('collectionId')
    }
    checkCollectionIds([])
  }

  const checkCollectionIds = (elements) => {
    const arr = [].concat(elements)
    const num = arr.length

    expect(collection.id).to.be.equal(num)
    expect(Object.keys(collection.data)).to.have.lengthOf(num)

    for (const [index, element] of arr.entries()) {
      expect(collection.data).to.have.property(index + 1)
      expect(element.dataset).to.have.property('collectionId', index + 1)
    }
  }

  const checkCollectionDataByElements = (elements, info) => {
    const arr = [].concat(elements)

    for (const element of arr) {
      const group = collection.data[element.dataset.collectionId][E][scriptUrl]

      for (const {loc, code} of info) {
        expect(group).to.have.property(loc, code)
      }
    }
  }

  const HTMLElementStub = function () {
    this.dataset = {}
  }

  /*************************/
  /*        DOM API        */
  /*************************/

  describe('DOM API', () => {
    let element

    beforeEach(() => {
      element = new HTMLElementStub()

      sandbox.stub(esprimaParser.context.document, 'getElementById')
        .returns(element)
    })

    /*************************/
    /*      HTMLElement      */
    /*************************/

    describe('HTMLElement tests', () => {
      beforeEach(() => {
        sandbox.stub(esprimaParser.context, 'HTMLElement', HTMLElementStub)
      })

      it('should add code to collection (call)', () => {
        element.addEventListener = sandbox.spy()
        element.removeEventListener = sandbox.spy()

        const ast = esprima.parse(`
          var element = document.getElementById('element');
          var clickHandler = function () {};

          element.addEventListener('click', clickHandler);
          element.removeEventListener('click', clickHandler);
        `, {loc: true})

        esprimaParser.parseAst(ast, scriptUrl)

        const clickHandler = closureStack.get('clickHandler')

        expect(element.addEventListener.calledWith('click', clickHandler)).to.be.true
        expect(element.removeEventListener.calledWith('click', clickHandler)).to.be.true

        checkCollectionIds(element)
        checkCollectionDataByElements(element, [
          {loc: `[5:10]-[5:57]`, code: 'element.addEventListener(\'click\', clickHandler)'},
          {loc: `[6:10]-[6:60]`, code: 'element.removeEventListener(\'click\', clickHandler)'}
        ])
      })

      it('should add code to collection (prop)', () => {
        const ast = esprima.parse(`
          var element = document.getElementById('element');
          var clickHandler = function () {};

          element.onclick = clickHandler;
        `, {loc: true})

        esprimaParser.parseAst(ast, scriptUrl)

        const clickHandler = closureStack.get('clickHandler')

        expect(element).to.have.property('onclick', clickHandler)

        checkCollectionIds(element)
        checkCollectionDataByElements(element, [
          {loc: `[5:10]-[5:40]`, code: 'element.onclick = clickHandler'}
        ])
      })

      it('should not add code to collection (prop)', () => {
        element.onclick = function () {}

        const ast = esprima.parse(`
          var element = document.getElementById('element');
          var clickHandler = element.onclick
        `, {loc: true})

        esprimaParser.parseAst(ast, scriptUrl)

        expect(closureStack.get('clickHandler')).to.be.equal(element.onclick)

        checkEmptyCollection(element)
      })
    })
  })

  /*************************/
  /*        jQuery         */
  /*************************/

  describe('jQuery', () => {
    let $element, elements

    const jQueryStub = function (arrElements) {
      if (!(this instanceof jQueryStub)) {
        return $element
      }
      this.elements = arrElements

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

    describe('event tests', () => {
      beforeEach(() => {
        $element.on = sandbox.spy()
      })

      it('should add code to collection', () => {
        const ast = esprima.parse(`
          var $element = jQuery('#element');
          var clickHandler = function () {};

          $element.on('click', clickHandler);
          $element.on({
            click: clickHandler
          })
        `, {loc: true})

        esprimaParser.parseAst(ast, scriptUrl)

        const clickHandler = closureStack.get('clickHandler')

        expect($element.on.calledTwice).to.be.true
        expect($element.on.getCall(0).calledWith('click', clickHandler)).to.be.true
        expect($element.on.getCall(1).calledWith({click: clickHandler})).to.be.true

        checkCollectionIds(elements)
        checkCollectionDataByElements(elements, [
          {loc: `[5:10]-[5:44]`, code: '$element.on(\'click\', clickHandler)'},
          {loc: `[6:10]-[8:12]`, code: '$element.on({ click: clickHandler })'}
        ])
      })

      it.skip('should add code to macthed children given event has selector argument', () => {
        children = [
          new HTMLElementStub(),
          new HTMLElementStub()
        ]
        $children = new jQueryStub(children)
        $element.find = sandbox.stub().returns($children)

        const ast = esprima.parse(`
          var $element = jQuery('#element');
          var clickHandler = function () {};

          $element.on('click', 'div', clickHandler);
        `, {loc: true})

        esprimaParser.parseAst(ast, scriptUrl)

        const clickHandler = closureStack.get('clickHandler')

        expect($element.on.calledWith('click', 'div', clickHandler)).to.be.true
        expect($element.find.calledWith('div')).to.be.true

        checkCollectionIds(children)
        checkCollectionDataByElements(children, [
          {loc: `[5:10]-[5:51]`, code: '$element.on(\'click\', \'div\', clickHandler)'},
        ])
      })
    })

    describe('event arg > 1 tests', () => {
      beforeEach(() => {
        $element.click = sandbox.spy()
      })

      it('should add code to collection', () => {
        const ast = esprima.parse(`
          var $element = jQuery('#element');
          var clickHandler = function () {};

          $element.click(clickHandler);
        `, {loc: true})

        esprimaParser.parseAst(ast, scriptUrl)

        const clickHandler = closureStack.get('clickHandler')

        expect($element.click.withArgs(clickHandler).calledOnce).to.be.true

        checkCollectionIds(elements)
        checkCollectionDataByElements(elements, [
          {loc: `[5:10]-[5:38]`, code: '$element.click(clickHandler)'}
        ])
      })

      it('should not add code to collection', () => {
        const ast = esprima.parse(`
          var $element = jQuery('#element');

          $element.click();
        `, {loc: true})

        esprimaParser.parseAst(ast, scriptUrl)

        expect($element.click.withArgs().calledOnce).to.be.true
        // this case would add manipulation to collection data,
        // so only test EVENT group is empty here
        for (const element of elements) {
          const eGroup = collection.data[element.dataset.collectionId][E]

          expect(Object.keys(eGroup)).to.have.lengthOf(0)
        }
      })
    })

    describe('document (has no dataset) tests', () => {
      it('should not add code to collection', () => {
        elements = [{}]
        $element = new jQueryStub(elements)
        $element.ready = sandbox.spy()

        const ast = esprima.parse(`
          var $element = jQuery('#element');
          var readyHandler = function () {};

          $element.ready(readyHandler)
        `, {loc: true})

        esprimaParser.parseAst(ast, scriptUrl)

        const readyHandler = closureStack.get('readyHandler')

        expect($element.ready.withArgs(readyHandler).calledOnce).to.be.true

        expect(collection.id).to.be.equal(0)
        expect(Object.keys(collection.data)).to.have.lengthOf(0)
      })
    })
  })
})
