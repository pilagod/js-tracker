describe('MANIPULATION of collection', () => {
  const scriptUrl = 'scriptUrl'
  let M, closureStack, collection

  before(() => {
    M = esprimaParser.Collection.MANIPULATION
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
      const mGroup = collection.data[element.dataset.collectionId][M]

      for (const {loc, code} of info) {
        expect(mGroup).to.have.property(loc, code)
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
    /*         Attr          */
    /*************************/

    describe('Attr tests', () => {
      const AttrStub = function () {
        this.ownerElement = element
      }
      beforeEach(() => {
        element.attributes = [new AttrStub()]

        sandbox.stub(esprimaParser.context, 'Attr', AttrStub)
      })

      it('should add code to collection', () => {
        const ast = esprima.parse(`
          var element = document.getElementById('element');
          var attrs = element.attributes;

          attrs[0].value = 'new value'
        `, {loc: true})

        esprimaParser.parseAst(ast, scriptUrl)

        expect(element.attributes[0]).to.have.property('value', 'new value')

        checkCollectionIds(element)
        checkCollectionDataByElements(element, [
          {loc: `${scriptUrl}:5:10`, code: 'attrs[0].value = \'new value\''}
        ])
      })

      it('should not add code to collection', () => {
        element.attributes[0].value = 'element'

        const ast = esprima.parse(`
          var element = document.getElementById('element');
          var attrs = element.attributes;
          var value = attrs[0].value;

          value = attrs[0].value;
          attrs[0].name = 'id';
        `, {loc: true})

        esprimaParser.parseAst(ast, scriptUrl)

        expect(element.attributes[0].name).to.be.equal('id')
        expect(closureStack.get('value')).to.be.equal('element')

        checkEmptyCollection(element)
      })
    })

    /*************************/
    /*  CSSStyleDeclaration  */
    /*************************/

    describe('CSSStyleDeclaration tests', () => {
      const CSSStyleDeclarationStub = function () {}

      beforeEach(() => {
        element.style = new CSSStyleDeclarationStub()

        sandbox.stub(
          esprimaParser.context,
          'CSSStyleDeclaration',
          CSSStyleDeclarationStub
        )
      })

      it('should add code to collection', () => {
        const ast = esprima.parse(`
          var element = document.getElementById('element');
          var style = element.style;

          element.style.color = 'red';
          style.backgroundColor = 'red';
        `, {loc: true})

        esprimaParser.parseAst(ast, scriptUrl)

        expect(element.style).to.have.property('color', 'red')
        expect(element.style).to.have.property('backgroundColor', 'red')

        checkCollectionIds(element);
        checkCollectionDataByElements(element, [
          {loc: `${scriptUrl}:5:10`, code: 'element.style.color = \'red\''},
          {loc: `${scriptUrl}:6:10`, code: 'style.backgroundColor = \'red\''}
        ])
      })

      it('should not add code to collection for getting style property', () => {
        element.style.color = 'red'

        const ast = esprima.parse(`
          var style = document.getElementById('element').style;
          var color = style.color;

          color = style.color;
        `, {loc: true})

        esprimaParser.parseAst(ast, scriptUrl)

        expect(closureStack.get('color')).to.be.equal('red')

        checkEmptyCollection(element)
      })
    })

    /*************************/
    /*      DOMTokenList     */
    /*************************/

    describe('DOMTokenList tests', () => {
      const DOMTokenListStub = function () {}

      beforeEach(() => {
        element.classList = new DOMTokenListStub()

        sandbox.stub(esprimaParser.context, 'DOMTokenList', DOMTokenListStub)
      })

      it('should add code to collection (add, remove, toggle)', () => {
        const classList = element.classList

        classList.add = sandbox.spy()
        classList.remove = sandbox.spy()
        classList.toggle = sandbox.spy()

        const ast = esprima.parse(`
          var element = document.getElementById('element');
          var classList = element.classList

          element.classList.add('class1');
          classList.remove('class2');
          classList.toggle('class3');
        `, {loc: true})

        esprimaParser.parseAst(ast, scriptUrl)

        expect(classList.parent).to.be.equal(element)
        expect(classList.add.calledWith('class1')).to.be.true
        expect(classList.remove.calledWith('class2')).to.be.true
        expect(classList.toggle.calledWith('class3')).to.be.true

        checkCollectionIds(element)
        checkCollectionDataByElements(element, [
          {loc: `${scriptUrl}:5:10`, code: 'element.classList.add(\'class1\')'},
          {loc: `${scriptUrl}:6:10`, code: 'classList.remove(\'class2\')'},
          {loc: `${scriptUrl}:7:10`, code: 'classList.toggle(\'class3\')'}
        ])
      })

      it('should not add code to collection (item, contains)', () => {
        const classList = element.classList

        classList.item = sandbox.stub().returns('class1')
        classList.contains = sandbox.stub().returns(true)

        const ast = esprima.parse(`
          var element = document.getElementById('element');
          var classList = element.classList

          var result1 = classList.item(1);
          var result2 = element.classList.contains('class1');
        `, {loc: true})

        esprimaParser.parseAst(ast, scriptUrl)

        expect(classList.parent).to.be.equal(element)
        expect(classList.item.calledWith(1)).to.be.true
        expect(classList.contains.calledWith('class1')).to.be.true

        expect(closureStack.get('result1')).to.be.equal('class1')
        expect(closureStack.get('result2')).to.be.true

        checkEmptyCollection(element)
      })
    })

    /*************************/
    /*      HTMLElement      */
    /*************************/

    describe('HTMLElement tests', () => {
      beforeEach(() => {
        sandbox.stub(esprimaParser.context, 'HTMLElement', HTMLElementStub)
      })

      it('should add code to collection', () => {
        element.append = sandbox.spy()

        const ast = esprima.parse(`
          var element = document.getElementById('element');

          element.append('text');
          element.innerHTML = 'Hello World';
        `, {loc: true})

        esprimaParser.parseAst(ast, scriptUrl)

        expect(element).to.have.property('innerHTML', 'Hello World')
        expect(element.append.calledWith('text')).to.be.true

        checkCollectionIds(element)
        checkCollectionDataByElements(element, [
          {loc: `${scriptUrl}:4:10`, code: 'element.append(\'text\')'},
          {loc: `${scriptUrl}:5:10`, code: 'element.innerHTML = \'Hello World\''}
        ])
      })

      it('should not add code to collection for getting property value', () => {
        element.id = 'element'
        element.innerHTML = 'Hello World'

        const ast = esprima.parse(`
          var element = document.getElementById('element');
          var id = element.id;
          var innerHTML = element.innerHTML;

          id = element.id;
          innerHTML = element.innerHTML;
        `, {loc: true})

        esprimaParser.parseAst(ast, scriptUrl)

        expect(closureStack.get('id')).to.be.equal(element.id)
        expect(closureStack.get('innerHTML')).to.be.equal(element.innerHTML)

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

    describe('mani tests', () => {
      it('should add code to collection', () => {
        $element.addClass = sandbox.spy()

        const ast = esprima.parse(`
          var $element = jQuery('#element');

          $element.addClass('class1');
        `, {loc: true})

        esprimaParser.parseAst(ast, scriptUrl)

        expect($element.addClass.calledWith('class1')).to.be.true

        checkCollectionIds(elements)
        checkCollectionDataByElements(elements, [
          {loc: `${scriptUrl}:4:10`, code: '$element.addClass(\'class1\')'}
        ])
      })
    })

    describe('mani arg0 tests', () => {
      beforeEach(() => {
        $element.click = sandbox.spy()
      })

      it('should add code to collection', () => {
        const ast = esprima.parse(`
          var $element = jQuery('#element');

          $element.click();
        `, {loc: true})

        esprimaParser.parseAst(ast, scriptUrl)

        expect($element.click.calledWith()).to.be.true

        checkCollectionIds(elements)
        checkCollectionDataByElements(elements, [
          {loc: `${scriptUrl}:4:10`, code: '$element.click()'}
        ])
      })

      it('should not add code to collection given args.length > 0', () => {
        const ast = esprima.parse(`
          var $element = jQuery('#element');

          $element.click(function () {});
        `, {loc: true})

        esprimaParser.parseAst(ast, scriptUrl)

        expect($element.click.calledWith(function () {}))

        // this case would add event to collection data,
        // so only test MANIPULATION is empty here
        for (const element of elements) {
          const mGroup = collection.data[element.dataset.collectionId][M]

          expect(Object.keys(mGroup)).to.have.lengthOf(0)
        }
      })
    })

    describe('mani arg1 tests', () => {
      beforeEach(() => {
        $element.height = sandbox.stub()
          .withArgs(sinon.match.string)
            .returns('100px')
      })

      it('should add code to collection', () => {
        const ast = esprima.parse(`
          var $element = jQuery('#element');

          $element.height('100px');
        `, {loc: true})

        esprimaParser.parseAst(ast, scriptUrl)

        expect($element.height.calledWith('100px')).to.be.true

        checkCollectionIds(elements)
        checkCollectionDataByElements(elements, [
          {loc: `${scriptUrl}:4:10`, code: '$element.height(\'100px\')'}
        ])
      })

      it('should not add code to collection', () => {
        const ast = esprima.parse(`
          var $element = jQuery('#element');
          var result = $element.height();
        `, {loc: true})

        esprimaParser.parseAst(ast, scriptUrl)

        expect($element.height.calledWith()).to.be.true
        expect(closureStack.get('result')).to.be.equal('100px')

        checkEmptyCollection(elements)
      })
    })

    describe('mani arg2 or object tests', () => {
      it('should add code to collection for args.length === 2', () => {
        $element.css = sandbox.spy()

        const ast = esprima.parse(`
          var $element = jQuery('#element');

          $element.css('color', 'red');
        `, {loc: true})

        esprimaParser.parseAst(ast, scriptUrl)

        expect($element.css.calledWith('color', 'red')).to.be.true

        checkCollectionIds(elements)
        checkCollectionDataByElements(elements, [
          {loc: `${scriptUrl}:4:10`, code: '$element.css(\'color\', \'red\')'}
        ])
      })

      it('should add code to collection for object type args[0]', () => {
        $element.css = sandbox.spy()

        const ast = esprima.parse(`
          var $element = jQuery('#element');

          $element.css({'background-color': 'red'});
        `, {loc: true})

        esprimaParser.parseAst(ast, scriptUrl)

        expect($element.css.calledWith({
          'background-color': 'red'
        })).to.be.true

        checkCollectionIds(elements)
        checkCollectionDataByElements(elements, [
          // escodegen.generate would add blank before and after an object
          {loc: `${scriptUrl}:4:10`, code: '$element.css({ \'background-color\': \'red\' })'}
        ])
      })

      it('should not add code to collection for getter usage', () => {
        $element.css = sandbox.stub().returns('red')

        const ast = esprima.parse(`
          var $element = jQuery('#element');
          var result = $element.css('color');
        `, {loc: true})

        esprimaParser.parseAst(ast, scriptUrl)

        expect(closureStack.get('result')).to.be.equal('red')

        expect($element.css.calledWith('color')).to.be.true

        checkEmptyCollection(elements)
      })
    })

    describe('mani passive tests', () => {
      it('should add code to collection', () => {
        const appendElements = [{}, {}]
        const $appendElement = new jQueryStub(appendElements)

        $appendElement.appendTo = sandbox.spy()
        // pre-set append elements
        esprimaParser.closureStack.set('$appendElement', $appendElement)

        const ast = esprima.parse(`
          $appendElement.appendTo('#element');
        `, {loc: true})

        esprimaParser.parseAst(ast, scriptUrl)

        expect($appendElement.appendTo.calledWith('#element')).to.be.true

        checkCollectionIds(elements)
        checkCollectionDataByElements(elements, [
          {loc: `${scriptUrl}:2:10`, code: '$appendElement.appendTo(\'#element\')'}
        ])
      })
    })
  })
})
