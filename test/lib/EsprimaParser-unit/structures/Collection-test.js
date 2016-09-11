describe.only('Collection tests', () => {
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
      const MANIPULATION = 'MANIPULATION'

      it('should return string \'MANIPULATION\'', () => {
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

      it('should call addInfoToElement with an object containing element, type and info', () => {
        collection.addInfoToElements(data)

        for (const [index, element] of elements.entries()) {
          expect(
            collection.addInfoToElement
              .getCall(index)
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
        code: 'code'
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

      it('should call getKey with info', () => {
        collection.addInfoToElement(data)

        expect(
          collection.getKey
            .calledWithExactly(info)
        ).to.be.true
      })

      it('should call getGroup with element and type', () => {
        collection.addInfoToElement(data)

        expect(
          collection.getGroup
            .calledWithExactly(element, type)
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
      const info = {
        loc: {
          start: {
            line: 2,
            column: 10
          }
        },
        scriptUrl: 'script.js'
      }
      it('should return a string of the format: {scriptUrl}:{startline}:{startColumn}', () => {
        const result = collection.getKey(info)

        expect(result).to.be.equal('script.js:2:10')
      })
    })

    /*************************/
    /*        getGroup       */
    /*************************/

    describe('getGroup tests', () => {
      const element = {}
      const type = 'type'
      // stub results
      const id = 'id'
      const group = {}

      beforeEach(() => {
        collection.data = {
          id: {
            type: group
          }
        }
        sandbox.stub(collection, 'getIdFromElement').returns(id)
      })

      it('should call getIdFromElement with element', () => {
        collection.getGroup(element, type)

        expect(
          collection.getIdFromElement
            .calledWithExactly(element)
        ).to.be.true
      })

      it('should return the group in data filtered by id and type', () => {
        const result = collection.getGroup(element, type)

        expect(result).to.be.equal(group)
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
      const key = 'script.js:2:10'
      const code = 'code'
      const info = {key, code}
      let group

      beforeEach(() => {
        group = {}
      })

      it('should set {key: code} to group given key not exists in it', () => {
        collection.addInfoToGroup(group, info)

        expect(Object.keys(group).length).to.be.equal(1)
        expect(group[key]).to.be.equal(code)
      })

      it('should not set {key: code} to group given key exists in it', () => {
        group[key] = 'other code'

        collection.addInfoToGroup(group, info)

        expect(Object.keys(group).length).to.be.equal(1)
        expect(group[key]).to.be.equal('other code')
      })
    })
  })
})
