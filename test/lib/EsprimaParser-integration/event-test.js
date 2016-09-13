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
      const eGroup = collection.data[element.dataset.collectionId][E]

      for (const {loc, code} of info) {
        expect(eGroup).to.have.property(loc, code)
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
          {loc: `${scriptUrl}:5:10`, code: 'element.addEventListener(\'click\', clickHandler)'},
          {loc: `${scriptUrl}:6:10`, code: 'element.removeEventListener(\'click\', clickHandler)'}
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
          {loc: `${scriptUrl}:5:10`, code: 'element.onclick = clickHandler'}
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

    describe('event tests', () => {
      it('should add code info to collection', () => {
        $element.on = sandbox.spy()

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
          {loc: `${scriptUrl}:5:10`, code: '$element.on(\'click\', clickHandler)'},
          {loc: `${scriptUrl}:6:10`, code: '$element.on({ click: clickHandler })'}
        ])
      })
    })

    describe('event arg > 1 tests', () => {
      it('should add code info to collection', () => {
        $element.click = sandbox.spy()

        const ast = esprima.parse(`
          var $element = jQuery('#element');
          var clickHandler = function () {};

          $element.click(clickHandler);
        `, {loc: true})

        esprimaParser.parseAst(ast, scriptUrl)

        const clickHandler = closureStack.get('clickHandler')

        expect($element.click.calledOnce).to.be.true
        expect($element.click.calledWith(clickHandler)).to.be.true

        checkCollectionIds(elements)
        checkCollectionDataByElements(elements, [
          {loc: `${scriptUrl}:5:10`, code: '$element.click(clickHandler)'}
        ])
      })

      it('should not add code info to collection', () => {
        const ast = esprima.parse(`
          var $element = jQuery('#element');

          $element.click();
        `, {loc: true})

        esprimaParser.parseAst(ast, scriptUrl)

        // this case would add manipulation to collection data,
        // so only test EVENT group is empty here
        for (const element of elements) {
          const eGroup = collection.data[element.dataset.collectionId][E]

          expect(Object.keys(eGroup)).to.have.lengthOf(0)
        }
      })
    })
  })
})
