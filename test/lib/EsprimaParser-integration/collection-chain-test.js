describe('Chain of collection', () => {
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
    this.dataset = {}
  }

  /*************************/
  /*        DOM API        */
  /*************************/

  describe('DOM API', () => {
    let element, child

    beforeEach(() => {
      element = new HTMLElementStub()
      child = new HTMLElementStub()

      element.appendChild = sandbox.stub().returns(child)
      sandbox.stub(esprimaParser.context, 'HTMLElement', HTMLElementStub)
      sandbox.stub(
        esprimaParser.context.document,
        'getElementById'
      ).returns(element)
    })

    it('should add chain manipulations properly', () => {
      const ast = esprima.parse(`
        var element = document.getElementById('element');

        element.appendChild('child').id = 'child';
      `, {loc: true})

      esprimaParser.parseAst(ast, scriptUrl)

      expect(element.dataset).to.have.property('collectionId', 1)
      expect(child.dataset).to.have.property('collectionId', 2)

      expect(collection.data[1][M][scriptUrl]).to.have.property('[4:8]-[4:36]', 'element.appendChild(\'child\')')
      expect(collection.data[2][M][scriptUrl]).to.have.property('[4:8]-[4:49]', 'element.appendChild(\'child\').id = \'child\'')
    })

    it('should add chain manipulation and event properly', () => {
      const ast = esprima.parse(`
        var element = document.getElementById('element');

        element.appendChild('child').addEventListener('click', function () {});
      `, {loc: true})

      esprimaParser.parseAst(ast, scriptUrl)

      expect(element.dataset).to.have.property('collectionId', 1)
      expect(child.dataset).to.have.property('collectionId', 2)

      expect(collection.data[1][M][scriptUrl]).to.have.property('[4:8]-[4:36]', 'element.appendChild(\'child\')')
      expect(collection.data[2][E][scriptUrl]).to.have.property('[4:8]-[4:78]', 'element.appendChild(\'child\').addEventListener(\'cli...')
    })
  })
})
