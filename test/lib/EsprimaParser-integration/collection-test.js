/*
  (1) esprima.parse should set option loc to true
  (2) esprimaParser.parseAst should set valid scriptUrl string
*/
describe('collection', () => {
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

  const checkEmptyCollection = (elements) => {
    for (const element of elements) {
      expect(element).to.not.have.property('CollectionId')
    }
    checkCollectionIds([])
  }

  const checkCollectionIds = (elements) => {
    const num = elements.length

    for (const [index, element] of elements.entries()) {
      expect(element).to.have.property('CollectionId', index + 1)
    }
    expect(collection.id).to.be.equal(num)
    expect(Object.keys(collection.data)).to.have.lengthOf(num)
  }

  const checkCollectionDataById = (id, mInfo = {}, eInfo = {}) => {
    const group = collection.data[id]

    if (!mInfo.ignore) {
      expect(Object.keys(group[M])).to.have.lengthOf(mInfo.num || 0)
    }
    if (!eInfo.ignore) {
      expect(Object.keys(group[E])).to.have.lengthOf(eInfo.num || 0)
    }
    for (const type of [M, E]) {
      const info = (type === M ? mInfo.info : eInfo.info) || []

      for (const {loc, code} of info) {
        expect(group[type]).to.have.property(loc, code)
      }
    }
  }

  /*************************/
  /*        DOM API        */
  /*************************/

  describe('DOM API', () => {
    const HTMLElementStub = function () {}
    let element

    beforeEach(() => {
      element = new HTMLElementStub()

      sandbox.stub(
        esprimaParser.context.document,
        'getElementById'
      ).returns(element)
    })

    /*************************/
    /*         Attr          */
    /*************************/

    describe('Attr tests', () => {
      const AttrStub = function () {
        this.ownerElement = element
      }
      beforeEach(() => {
        element.attributes = [
          new AttrStub()
        ]
        sandbox.stub(esprimaParser.context, 'Attr', AttrStub)
      })

      describe('MANIPULATION tests', () => {
        it('should add code info to collection', () => {
          const ast = esprima.parse(`
            var element = document.getElementById('element');
            var attrs = element.attributes;

            attrs[0].value = 'new value'
          `, {loc: true})

          esprimaParser.parseAst(ast, scriptUrl)

          expect(element.attributes[0]).to.have.property('value', 'new value')

          checkCollectionIds([element])
          checkCollectionDataById(1, {
            num: 1, info: [
              {loc: `${scriptUrl}:5:12`, code: 'attrs[0].value = \'new value\''}
            ]
          })
        })

        it('should not add code info to collection', () => {
          element.attributes[0].value = 'element'

          const ast = esprima.parse(`
            var element = document.getElementById('element');
            var attrs = element.attributes;
            var value = attrs[0].value;

            value = attrs[0].value;
            attrs[0].name = 'id';
          `, {loc: true})

          esprimaParser.parseAst(ast, scriptUrl)

          expect(closureStack.get('value')).to.be.equal('element')
          expect(element.attributes[0].name).to.be.equal('id')

          checkEmptyCollection([element])
        })
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

      describe('MANIPULATION tests', () => {
        it('should add call info to collection', () => {
          const ast = esprima.parse(`
            var element = document.getElementById('element');
            var style = element.style;

            element.style.color = 'red';
            style.backgroundColor = 'red';
          `, {loc: true})

          esprimaParser.parseAst(ast, scriptUrl)

          expect(element.style).to.have.property('color', 'red')
          expect(element.style).to.have.property('backgroundColor', 'red')

          checkCollectionIds([element]);
          checkCollectionDataById(1, {
            num: 2, info: [
              {loc: `${scriptUrl}:5:12`, code: 'element.style.color = \'red\''},
              {loc: `${scriptUrl}:6:12`, code: 'style.backgroundColor = \'red\''}
            ]
          })
        })

        it('should not add call info to collection for getting style property', () => {
          const ast = esprima.parse(`
            var style = document.getElementById('element').style;
            var color = style.color;
          `, {loc: true})

          esprimaParser.parseAst(ast, scriptUrl)

          checkEmptyCollection([element])
        })
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

      describe('MANIPULATION tests', () => {
        it('should add code info to collection (add, remove, toggle)', () => {
          const classList = element.classList

          classList.add = sandbox.spy()
          classList.remove = sandbox.spy()
          classList.toggle = sandbox.spy()

          const ast = esprima.parse(`
            var element = document.getElementById('element');
            var classList = element.classList

            var result1 = element.classList.add('class1');
            var result2 = classList.remove('class2');
            var result3 = classList.toggle('class3');
          `, {loc: true})

          esprimaParser.parseAst(ast, scriptUrl)

          for (const index of [1, 2, 3]) {
            expect(closureStack.get(`result${index}`)).to.be.undefined
          }
          expect(classList.parent).to.be.equal(element)
          expect(classList.add.calledWith('class1')).to.be.true
          expect(classList.remove.calledWith('class2')).to.be.true
          expect(classList.toggle.calledWith('class3')).to.be.true

          checkCollectionIds([element])
          checkCollectionDataById(1, {
            num: 3, info: [
              {loc: `${scriptUrl}:5:26`, code: 'element.classList.add(\'class1\')'},
              {loc: `${scriptUrl}:6:26`, code: 'classList.remove(\'class2\')'},
              {loc: `${scriptUrl}:7:26`, code: 'classList.toggle(\'class3\')'}
            ]
          })
        })

        it('should not add code info to collection (item, contains)', () => {
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

          checkEmptyCollection([element])
        })
      })
    })

    /*************************/
    /*      HTMLElement      */
    /*************************/

    describe('HTMLElement tests', () => {
      beforeEach(() => {
        sandbox.stub(esprimaParser.context, 'HTMLElement', HTMLElementStub)
      })

      describe('MANIPULATION tests', () => {
        it('should add code info to collection', () => {
          element.append = sandbox.spy()

          const ast = esprima.parse(`
            var element = document.getElementById('element');
            var result = element.append('text');

            element.innerHTML = 'Hello World';
          `, {loc: true})

          esprimaParser.parseAst(ast, scriptUrl)

          expect(closureStack.get('result')).to.be.undefined

          expect(element).to.have.property('innerHTML', 'Hello World')
          expect(element.append.calledWith('text')).to.be.true

          checkCollectionIds([element])
          checkCollectionDataById(1, {
            num: 2, info: [
              {loc: `${scriptUrl}:3:25`, code: 'element.append(\'text\')'},
              {loc: `${scriptUrl}:5:12`, code: 'element.innerHTML = \'Hello World\''}
            ]
          })
        })

        it('should not add code info to collection for getting property value', () => {
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

          checkEmptyCollection([element])
        })
      })

      describe('EVENT tests', () => {
        it('should add code info to collection (call)', () => {
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

          checkCollectionIds([element])
          checkCollectionDataById(1, undefined, {
            num: 2, info: [
              {loc: `${scriptUrl}:5:12`, code: 'element.addEventListener(\'click\', clickHandler)'},
              {loc: `${scriptUrl}:6:12`, code: 'element.removeEventListener(\'click\', clickHandler)'}
            ]
          })
        })

        it('should add code info to collection (prop)', () => {
          element.addEventListener = sandbox.spy()

          const ast = esprima.parse(`
            var element = document.getElementById('element');
            var clickHandler = function () {};

            element.onclick = clickHandler;
          `, {loc: true})

          esprimaParser.parseAst(ast, scriptUrl)

          const clickHandler = closureStack.get('clickHandler')

          expect(element).to.have.property('onclick', clickHandler)

          checkCollectionIds([element])
          checkCollectionDataById(1, undefined, {
            num: 1, info: [
              {loc: `${scriptUrl}:5:12`, code: 'element.onclick = clickHandler'}
            ]
          })
        })
      })
    })
  })

  /*************************/
  /*        jQuery         */
  /*************************/

  const checkCollectionDataByElements = (elements, mInfo, eInfo) => {
    for (const element of elements) {
      checkCollectionDataById(element.CollectionId, mInfo, eInfo)
    }
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
      elements = [{}, {}]
      $element = new jQueryStub(elements)
    })

    describe('MANIPULATION', () => {
      describe('mani tests', () => {
        it('should add code info to collection', () => {
          $element.addClass = sandbox.spy()

          const ast = esprima.parse(`
            var $element = jQuery('#element');

            $element.addClass('class1');
          `, {loc: true})

          esprimaParser.parseAst(ast, scriptUrl)

          expect($element.addClass.calledWith('class1')).to.be.true

          checkCollectionIds(elements)
          checkCollectionDataByElements(elements, {
            num: 1, info: [
              {loc: `${scriptUrl}:4:12`, code: '$element.addClass(\'class1\')'}
            ]
          })
        })
      })

      describe('mani arg0 tests', () => {
        beforeEach(() => {
          $element.click = sandbox.spy()
        })

        it('should add code info to collection', () => {
          const ast = esprima.parse(`
            var $element = jQuery('#element');

            $element.click();
          `, {loc: true})

          esprimaParser.parseAst(ast, scriptUrl)

          expect($element.click.calledWith()).to.be.true

          checkCollectionIds(elements)
          checkCollectionDataByElements(elements, {
            num: 1, info: [
              {loc: `${scriptUrl}:4:12`, code: '$element.click()'}
            ]
          })
        })

        it('should not add code info to collection given args.length > 0', () => {
          const ast = esprima.parse(`
            var $element = jQuery('#element');

            $element.click(function () {});
          `, {loc: true})

          esprimaParser.parseAst(ast, scriptUrl)

          expect($element.click.calledWith(function () {}))
          // this case would add event to collection data,
          // use checkCollectionDataByElements instead of checkEmptyCollection
          checkCollectionDataByElements(elements, undefined, {ignore: true})
        })
      })

      describe('mani arg1 tests', () => {
        beforeEach(() => {
          $element.height = sandbox.stub()
            .withArgs(sinon.match.string)
              .returns('100px')
        })

        it('should add code info to collection', () => {
          const ast = esprima.parse(`
            var $element = jQuery('#element');

            $element.height('100px');
          `, {loc: true})

          esprimaParser.parseAst(ast, scriptUrl)

          expect($element.height.calledWith('100px')).to.be.true

          checkCollectionIds(elements)
          checkCollectionDataByElements(elements, {
            num: 1, info: [
              {loc: `${scriptUrl}:4:12`, code: '$element.height(\'100px\')'}
            ]
          })
        })

        it('should not add code info to collection', () => {
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
        it('should add code info to collection for args.length === 2', () => {
          $element.css = sandbox.spy()

          const ast = esprima.parse(`
            var $element = jQuery('#element');

            $element.css('color', 'red');
          `, {loc: true})

          esprimaParser.parseAst(ast, scriptUrl)

          expect($element.css.calledWith('color', 'red')).to.be.true

          checkCollectionIds(elements)
          checkCollectionDataByElements(elements, {
            num: 1, info: [
              {loc: `${scriptUrl}:4:12`, code: '$element.css(\'color\', \'red\')'}
            ]
          })
        })

        it('should add code info to collection for object type args[0]', () => {
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
          checkCollectionDataByElements(elements, {
            num: 1, info: [
              // escodegen.generate would add blank before and after an object
              {loc: `${scriptUrl}:4:12`, code: '$element.css({ \'background-color\': \'red\' })'}
            ]
          })
        })

        it('should not add code info to collection for getter usage', () => {
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
        it('should add code info to collection', () => {
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
          checkCollectionDataByElements(elements, {
            num: 1, info: [
              {loc: `${scriptUrl}:2:12`, code: '$appendElement.appendTo(\'#element\')'}
            ]
          })
        })
      })
    })

    describe('EVENT', () => {
      describe('event tests', () => {
        it('should add code info to collection', () => {
          $element.on = sandbox.stub().returns($element)

          const ast = esprima.parse(`
            var $element = jQuery('#element');
            var clickHandler = function () {};
            var result1 = $element.on('click', clickHandler);
            var result2 = $element.on({
              click: clickHandler
            })
          `, {loc: true})

          esprimaParser.parseAst(ast, scriptUrl)

          for (const index of [1, 2]) {
            expect(closureStack.get(`result${index}`)).to.be.equal($element)
          }
          const clickHandler = closureStack.get('clickHandler')

          expect($element.on.calledTwice).to.be.true
          expect($element.on.getCall(0).calledWith('click', clickHandler)).to.be.true
          expect($element.on.getCall(1).calledWith({click: clickHandler})).to.be.true

          checkCollectionIds(elements)
          checkCollectionDataByElements(elements, undefined, {
            num: 2, info: [
              {loc: `${scriptUrl}:4:26`, code: '$element.on(\'click\', clickHandler)'},
              {loc: `${scriptUrl}:5:26`, code: '$element.on({ click: clickHandler })'}
            ]
          })
        })
      })

      describe('event arg > 1 tests', () => {
        it('should add code info to collection', () => {
          $element.click = sandbox.stub().returns($element)

          const ast = esprima.parse(`
            var $element = jQuery('#element');
            var clickHandler = function () {};
            var result = $element.click(clickHandler);
          `, {loc: true})

          esprimaParser.parseAst(ast, scriptUrl)

          expect(closureStack.get('result')).to.be.equal($element)

          const clickHandler = closureStack.get('clickHandler')

          expect($element.click.calledWith(clickHandler)).to.be.true

          checkCollectionIds(elements)
          checkCollectionDataByElements(elements, undefined, {
            num: 1, info: [
              {loc: `${scriptUrl}:4:25`, code: '$element.click(clickHandler)'}
            ]
          })
        })

        it('should not add code info to collection', () => {
          const ast = esprima.parse(`
            var $element = jQuery('#element');

            $element.click();
          `, {loc: true})

          esprimaParser.parseAst(ast, scriptUrl)

          // this case would add manipulation to collection data,
          // use checkCollectionDataByElements instead of checkEmptyCollection
          checkCollectionDataByElements(elements, {ignore: true})
        })
      })
    })
  })
})
