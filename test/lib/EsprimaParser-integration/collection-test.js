/*
  (1) esprima.parse should set option loc to true
  (2) esprimaParser.parseAst should set valid scriptUrl string
*/
describe.only('collection', () => {
  const scriptUrl = 'scriptUrl'
  let M, E, closureStack, collection

  beforeEach(() => {
    M = esprimaParser.Collection.MANIPULATION
    E = esprimaParser.Collection.EVENT
    closureStack = esprimaParser.closureStack
    collection = esprimaParser.collection
  })

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

    describe("Attr tests", () => {
      const AttrStub = function () {
        this.ownerElement = element
      }
      beforeEach(() => {
        element.attributes = [
          new AttrStub(),
          new AttrStub(),
          new AttrStub()
        ]
        sandbox.stub(esprimaParser.context, 'Attr', AttrStub)
      })

      it('should add code info to collection', () => {
        const ast = esprima.parse(`
          var element = document.getElementById('element');
          var attrs = element.attributes;

          attrs[0].value = 'new element id'
        `, {loc: true})

        esprimaParser.parseAst(ast, scriptUrl)

        expect(element).to.have.property('CollectionId')
        expect(element.attributes[0]).to.not.have.property('value')

        const id = element.CollectionId

        expect(id).to.be.equal(collection.id).and.equal(1)

        expect(Object.keys(collection.data)).to.have.lengthOf(1)
        expect(Object.keys(collection.data[id][M])).to.have.lengthOf(1)
        expect(Object.keys(collection.data[id][E])).to.have.lengthOf(0)

        expect(collection.data[id][M]).to.have.property(`${scriptUrl}:5:10`, 'attrs[0].value')
      })

      it('should not add code info to collection', () => {
        element.attributes[0].value = 'element'

        const ast = esprima.parse(`
          var element = document.getElementById('element');
          var attrs = element.attributes;
          var value = attrs[0].value

          attrs[0].name = 'new element'
          value = attrs[0].value
        `, {loc: true})

        esprimaParser.parseAst(ast, scriptUrl)

        expect(element).to.not.have.property('CollectionId')
        expect(element.attributes[0].name).to.be.equal('new element')
        expect(closureStack.get('value')).to.be.equal(element.attributes[0].value)

        expect(collection.id).to.be.equal(0)
        expect(Object.keys(collection.data)).to.have.lengthOf(0)
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

      it('should add call info to collection', () => {
        const ast = esprima.parse(`
          var element = document.getElementById('element');
          var style = element.style;

          element.style.color = 'red';
          style.backgroundColor = 'red';
        `, {loc: true})

        esprimaParser.parseAst(ast, scriptUrl)

        expect(element).to.have.property('CollectionId')
        expect(element.style).to.not.have.property('color') // should not change view
        expect(element.style).to.not.have.property('backgroundColor') // should not change view

        const id = element.CollectionId

        expect(id).to.be.equal(collection.id).and.equal(1)

        expect(Object.keys(collection.data)).to.have.lengthOf(1)
        expect(Object.keys(collection.data[id][M])).to.have.lengthOf(2)
        expect(Object.keys(collection.data[id][E])).to.have.lengthOf(0)

        expect(collection.data[id][M]).to.have.property(`${scriptUrl}:5:10`, 'element.style.color')
        expect(collection.data[id][M]).to.have.property(`${scriptUrl}:6:10`, 'style.backgroundColor')
      })

      it('should not add call info to collection for getting style property', () => {
        const ast = esprima.parse(`
          var style = document.getElementById('element').style;
          var color = style.color;
        `, {loc: true})

        esprimaParser.parseAst(ast, scriptUrl)

        expect(element).to.not.have.property('CollectionId')

        expect(collection.id).to.be.equal(0)
        expect(Object.keys(collection.data)).to.have.lengthOf(0)
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

        expect(element).to.have.property('CollectionId')
        expect(classList.add.called).to.be.false
        expect(classList.remove.called).to.be.false
        expect(classList.toggle.called).to.be.false

        expect(closureStack.get('result1')).to.be.undefined
        expect(closureStack.get('result2')).to.be.undefined
        expect(closureStack.get('result3')).to.be.undefined

        const id = element.CollectionId

        expect(id).to.be.equal(collection.id).and.equal(1)

        expect(Object.keys(collection.data)).to.have.lengthOf(1)
        expect(Object.keys(collection.data[id][M])).to.have.lengthOf(3)
        expect(Object.keys(collection.data[id][E])).to.have.lengthOf(0)

        expect(collection.data[id][M]).to.have.property(`${scriptUrl}:5:24`, 'element.classList.add(\'class1\')')
        expect(collection.data[id][M]).to.have.property(`${scriptUrl}:6:24`, 'classList.remove(\'class2\')')
        expect(collection.data[id][M]).to.have.property(`${scriptUrl}:7:24`, 'classList.toggle(\'class3\')')
      })

      it('should not add code info to collection (item, contains)', () => {
        const classList = element.classList

        classList.item = sandbox.stub().returns('class1')
        classList.contains = sandbox.stub().returns(true)

        const ast = esprima.parse(`
          var element = document.getElementById('element');
          var classList = element.classList

          var result1 = element.classList.contains('class1');
          var result2 = classList.item(1);
        `, {loc: true})

        esprimaParser.parseAst(ast, scriptUrl)

        expect(element).to.not.have.property('CollectionId')
        expect(classList.contains.calledWith('class1')).to.be.true
        expect(classList.item.calledWith(1)).to.be.true

        expect(closureStack.get('result1')).to.be.true
        expect(closureStack.get('result2')).to.be.equal('class1')

        expect(collection.id).to.be.equal(0)
        expect(Object.keys(collection.data)).to.have.lengthOf(0)
      })
    })

    /*************************/
    /*      HTMLElement      */
    /*************************/

    describe('HTMLElement tests', () => {
      beforeEach(() => {
        sandbox.stub(esprimaParser.context, 'HTMLElement', HTMLElementStub)
      })

      it('should add code info to collection (MANIPULATION)', () => {
        element.append = sandbox.spy()

        const ast = esprima.parse(`
          var element = document.getElementById('element');
          var result = element.append('Some Text');

          element.innerHTML = 'Hello World';
        `, {loc: true})

        esprimaParser.parseAst(ast, scriptUrl)

        expect(element).to.have.property('CollectionId')
        expect(element).to.not.have.property('innerHTML')
        expect(element.append.called).to.be.false

        expect(closureStack.get('result')).to.be.undefined

        const id = element.CollectionId

        expect(id).to.be.equal(collection.id).and.equal(1)

        expect(Object.keys(collection.data)).to.have.lengthOf(1)
        expect(Object.keys(collection.data[id][M])).to.have.lengthOf(2)
        expect(Object.keys(collection.data[id][E])).to.have.lengthOf(0)

        expect(collection.data[id][M]).to.have.property(`${scriptUrl}:3:23`, 'element.append(\'Some Text\')')
        expect(collection.data[id][M]).to.have.property(`${scriptUrl}:5:10`, 'element.innerHTML')
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

        expect(element).to.not.have.property('CollectionId')

        expect(closureStack.get('id')).to.be.equal(element.id)
        expect(closureStack.get('innerHTML')).to.be.equal(element.innerHTML)

        expect(collection.id).to.be.equal(0)
        expect(Object.keys(collection.data)).to.have.lengthOf(0)
      })

      it('should add code info to collection (EVENT call)', () => {
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

        expect(element).to.have.property('CollectionId')
        expect(element.addEventListener.calledWith('click', clickHandler)).to.be.true
        expect(element.removeEventListener.calledWith('click', clickHandler)).to.be.true

        const id = element.CollectionId

        expect(id).to.be.equal(collection.id).and.equal(1)

        expect(Object.keys(collection.data)).to.have.lengthOf(1)
        expect(Object.keys(collection.data[id][M])).to.have.lengthOf(0)
        expect(Object.keys(collection.data[id][E])).to.have.lengthOf(2)

        expect(collection.data[id][E]).to.have.property(`${scriptUrl}:5:10`, 'element.addEventListener(\'click\', clickHandler)')
        expect(collection.data[id][E]).to.have.property(`${scriptUrl}:6:10`, 'element.removeEventListener(\'click\', clickHandler)')
      })

      it('should add code info to collection (EVENT prop)', () => {
        element.addEventListener = sandbox.spy()

        const ast = esprima.parse(`
          var element = document.getElementById('element');
          var clickHandler = function () {};

          element.onclick = clickHandler;
        `, {loc: true})

        esprimaParser.parseAst(ast, scriptUrl)

        const clickHandler = closureStack.get('clickHandler')

        expect(element).to.have.property('CollectionId')
        expect(element.addEventListener.calledWith('click', clickHandler)).to.be.true

        const id = element.CollectionId

        expect(id).to.be.equal(collection.id).and.equal(1)

        expect(Object.keys(collection.data)).to.have.lengthOf(1)
        expect(Object.keys(collection.data[id][M])).to.have.lengthOf(0)
        expect(Object.keys(collection.data[id][E])).to.have.lengthOf(1)

        expect(collection.data[id][E]).to.have.property(`${scriptUrl}:5:10`, 'element.onclick')
      })
    })
  })

  /*************************/
  /*        jQuery         */
  /*************************/

  describe('jQuery', () => {

  })
})
