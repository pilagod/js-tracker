describe('Collection tests', () => {
  let Collection

  before(() => {
    Collection = require(`${libDir}/structures/Collection`)
  })

  describe('constructor tests', () => {
    it('should set property id to 0', () => {
      const collection = new Collection()

      expect(collection.id).to.be.equal(0)
    })

    it('should set property data to empty object', () => {
      const collection = new Collection()

      expect(collection.data).to.be.eql({})
    })
  })

  describe('static tests', () => {
    describe('getter of EVENT', () => {
      const EVENT = 'EVENT'

      it('should return string \'EVENT\'', () => {
        expect(Collection.EVENT).to.be.equal(EVENT)
      })
    })

    describe('getter of MANIPULATION', () => {
      const MANIPULATION = 'MANIP'

      it('should return string \'MANIP\'', () => {
        expect(Collection.MANIPULATION).to.be.equal(MANIPULATION)
      })
    })
  })

  describe('methods tests', () => {
    let collection

    beforeEach(() => {
      collection = new Collection()
    })

    /*************************/
    /*          get          */
    /*************************/

    describe('get tests', () => {
      it('should get code info from given id', () => {
        const data = {
          [collection.MANIPULATION]: {},
          [collection.EVENT]: {}
        }
        collection.data[1] = data

        const result = collection.get(1)

        expect(result).to.be.equal(data)
      })
    })

    /*************************/
    /*    addInfoToElements  */
    /*************************/

    describe('addInfoToElements tests', () => {
      const elements = ['element1', 'element2', 'element3']
      const type = 'type'
      const info = {}
      const data = {elements, type, info}

      beforeEach(() => {
        sandbox.stub(collection, 'addInfoToElement')
      })

      it('should call addInfoToElement each iteration with an object containing each element, type and info', () => {
        collection.addInfoToElements(data)

        for (const [index, element] of elements.entries()) {
          const addInfoToElementCall =
            collection.addInfoToElement.getCall(index)
          expect(
            addInfoToElementCall
              .calledWithExactly({element, type, info})
          ).to.be.true
        }
      })
    })

    /*************************/
    /*    addInfoToElement   */
    /*************************/

    describe('addInfoToElement tests', () => {
      const element = {}
      const type = 'type'
      const info = {
        code: 'code',
        loc: {},
        scriptUrl: 'scriptUrl'
      }
      const data = {element, type, info}
      // stub results
      const key = 'key'
      const group = {}

      beforeEach(() => {
        sandbox.stub(collection, 'getKey').returns(key)
        sandbox.stub(collection, 'getGroup').returns(group)
        sandbox.stub(collection, 'addInfoToGroup')
      })

      it('should call getKey with info.loc', () => {
        collection.addInfoToElement(data)

        expect(
          collection.getKey
            .calledWithExactly(info.loc)
        ).to.be.true
      })

      it('should call getGroup with an object containing element of element, type of type and scriptUrl of info.scriptUrl', () => {
        collection.addInfoToElement(data)

        expect(
          collection.getGroup
            .calledWithExactly({
              element,
              type,
              scriptUrl: info.scriptUrl
            })
        ).to.be.true
      })

      it('should call addInfoToGroup with group and an object containing key of result from getKey and code of info.code', () => {
        collection.addInfoToElement(data)

        expect(
          collection.addInfoToGroup
            .calledWithExactly(group, {
              key,
              code: info.code
            })
        ).to.be.true
      })
    })

    /*************************/
    /*         getKey        */
    /*************************/

    describe('getKey tests', () => {
      const loc = {
        start: {
          line: 2,
          column: 10
        },
        end: {
          line: 3,
          column: 12
        }
      }
      it('should return a string of the format: [{start.line}:{start.column}]-[{end.line}:{end.column}]', () => {
        const result = collection.getKey(loc)

        expect(result).to.be.equal('[2:10]-[3:12]')
      })
    })

    /*************************/
    /*        getGroup       */
    /*************************/

    describe('getGroup tests', () => {
      const element = {}
      const scriptUrl = 'scriptUrl'
      // stub results
      const id = 1
      let type, data, group

      beforeEach(() => {
        type = Collection.EVENT
        data = {element, type, scriptUrl}
        group = {}

        collection.data = {
          [id]: {
            [type]: group
          }
        }
        sandbox.stub(collection, 'getIdFromElement').returns(id)
      })

      it('should call getIdFromElement with element', () => {
        collection.getGroup(data)

        expect(
          collection.getIdFromElement
            .calledWithExactly(element)
        ).to.be.true
      })

      it('should set data[id][type][scriptUrl] to empty object if it had not been set', () => {
        collection.getGroup(data)

        expect(group).to.have.property(scriptUrl).and.be.eql({})
      })

      it('should not set data[id][type][scriptUrl] given it had been set', () => {
        const groupData = {
          '[1:2]-[3:4]': 'some code'
        }
        group[scriptUrl] = groupData

        collection.getGroup(data)

        expect(group).to.have.property(scriptUrl).and.be.equal(groupData)
      })

      it('should return the group in data filtered by id, type and scriptUrl', () => {
        const result = collection.getGroup(data)

        expect(group).to.have.property(scriptUrl)
        expect(result).to.be.equal(group[scriptUrl])
      })
    })

    /*************************/
    /*    getIdFromElement   */
    /*************************/

    describe('getIdFromElement tests', () => {
      let element

      beforeEach(() => {
        element = {
          dataset: {}
        }
        sandbox.stub(collection, 'createCollection')
      })

      it('should call createCollection given element.dataset has no property collectionId', () => {
        collection.getIdFromElement(element)

        expect(collection.createCollection.calledOnce).to.be.true
        expect(collection.createCollection.calledWith()).to.be.true
      })

      it('should set element.dataset.collectionId to result from createCollection and return given element.dataset has no property collectionId', () => {
        const collectionId = 1

        collection.createCollection.returns(collectionId)

        const result = collection.getIdFromElement(element)

        expect(element.dataset.collectionId).to.be.equal(collectionId)
        expect(result).to.be.equal(collectionId)
      })

      it('should directly return element.dataset.collectionId given element.dataset has property collectionId', () => {
        const collectionId = 2

        element.dataset.collectionId = collectionId

        const result = collection.getIdFromElement(element)

        expect(collection.createCollection.called).to.be.false
        expect(result).to.be.equal(collectionId)
      })
    })

    /*************************/
    /*    createCollection   */
    /*************************/

    describe('createCollection tests', () => {
      it('should increment id by 1', () => {
        collection.createCollection()

        expect(collection.id).to.be.equal(1)
      })

      it('should add and init a new collection with new id as key', () => {
        const expectedCollection = {
          '1': {
            [Collection.MANIPULATION]: {},
            [Collection.EVENT]: {}
          }
        }
        collection.createCollection()

        expect(collection.data).to.be.eql(expectedCollection)
      })

      it('should return new id', () => {
        const result = collection.createCollection()

        expect(result).to.be.equal(1)
      })
    })

    /****************************/
    /*      addInfoToGroup      */
    /****************************/

    describe('addInfoToGroup tests', () => {
      const key = '[2:10]-[3:11]'
      const code = 'code'
      const info = {key, code}
      let group
      // stub results
      const normalizedCode = 'normalizedCode'

      beforeEach(() => {
        group = {}

        sandbox.stub(collection, 'normalizeCode')
          .withArgs(code)
            .returns(normalizedCode)
      })

      it('should set key to result from normalizeCode called with code in group given key not exists in it', () => {
        collection.addInfoToGroup(group, info)

        expect(
          collection.normalizeCode
            .calledWithExactly(code)
        ).to.be.true
        expect(group).to.have.property(key, normalizedCode)
      })

      it('should not set key and code to group given key already exists in it', () => {
        group[key] = 'someOtherNormalizedCode'

        collection.addInfoToGroup(group, info)

        expect(collection.normalizeCode.called).to.be.false
        expect(group).to.have.property(key, 'someOtherNormalizedCode')
      })
    })

    /*************************/
    /*     normalizeCode     */
    /*************************/

    describe('normalizeCode tests', () => {
      it('should return a sub string of given string to max length 50, with ... for remaining not show string', () => {
        const result = collection.normalizeCode('document.getElementById(\'demo\').classList.add(\'demoHightlight\')')

        expect(result).to.be.equal('document.getElementById(\'demo\').classList.add(\'dem...')
      })

      it('should return same string given string does not have max length greater than 50', () => {
        const result = collection.normalizeCode('element.style.color = \'red\'')

        expect(result).to.be.equal('element.style.color = \'red\'')
      })
    })
  })
})
