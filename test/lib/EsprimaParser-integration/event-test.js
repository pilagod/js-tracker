describe.only('EVENT of collection', () => {
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
      const group = collection.data[element.dataset.collectionId][E]

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
    
  })
})
