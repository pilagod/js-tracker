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

    describe('addEvent tests', () => {
      const info = {
        elements: [],
        info: {}
      }
      beforeEach(() => {
        sandbox.stub(collection, 'addFromElements')
      })

      it('should call addFromElements with given info and type Collection.EVENT', () => {
        collection.addEvent(info)

        expect(
          collection.addFromElements
            .calledWithExactly(info, Collection.EVENT)
        ).to.be.true
      })
    })

    describe('addManipulation tests', () => {
      const info = {
        elements: [],
        info: {}
      }
      beforeEach(() => {
        sandbox.stub(collection, 'addFromElements')
      })

      it('should call addFromElements with given info and type Collection.MANIPULATION', () => {
        collection.addManipulation(info)

        expect(
          collection.addFromElements
            .calledWithExactly(info, Collection.MANIPULATION)
        ).to.be.true
      })
    })

    describe('addFromElements tests', () => {
      const info = {
        elements: ['element1', 'element2', 'element3'],
        info: {}
      }
      const type = 'type'

      beforeEach(() => {
        sandbox.stub(collection, 'add')
      })

      it('should call add with each element and info and type', () => {
        collection.addFromElements(info, type)

        for (const [index, element] of info.elements.entries()) {
          expect(
            collection.add
              .getCall(index)
                .calledWithExactly(element, info.info, type)
          ).to.be.true
        }
      })
    })

    describe('add tests', () => {
      const element = 'element'
      const info = {
        code: 'code'
      }
      const type = 'type'
      // stub results
      const id = 'id'
      const group = {}
      const key = 'key'

      beforeEach(() => {
        sandbox.stub(collection, 'getCollectionIdFrom').returns(id)
        sandbox.stub(collection, 'getCollectionGroup').returns(group)
        sandbox.stub(collection, 'getKeyFrom').returns(key)
        sandbox.stub(collection, 'addCodeToCollectionGroup')
      })

      it('should call getCollectionIdFrom with element', () => {
        collection.add(element, info, type)

        expect(
          collection.getCollectionIdFrom
            .calledWithExactly(element)
        ).to.be.true
      })

      it('should call getCollectionGroup with id from getCollectionIdFrom and type', () => {
        collection.add(element, info, type)

        expect(
          collection.getCollectionGroup
            .calledWithExactly(id, type)
        ).to.be.true
      })

      it('should call getKeyFrom with info', () => {
        collection.add(element, info, type)

        expect(
          collection.getKeyFrom
            .calledWithExactly(info)
        ).to.be.true
      })

      it('should call addCodeToCollectionGroup with group, key and code', () => {
        collection.add(element, info, type)

        expect(
          collection.addCodeToCollectionGroup
            .calledWithExactly(group, key, info.code)
        ).to.be.true
      })
    })

    describe('getCollectionIdFrom tests', () => {
      let element

      beforeEach(() => {
        element = {}

        sandbox.stub(collection, 'createElementCollection')
      })

      it('should call createElementCollection given element has no CollectionId', () => {
        collection.getCollectionIdFrom(element)

        expect(collection.createElementCollection.called).to.be.true
      })

      it('should set element CollectionId to the result from createElementCollection and return given element has no CollectionId', () => {
        collection.createElementCollection.returns(1)

        const result = collection.getCollectionIdFrom(element)

        expect(element.CollectionId).to.be.equal(1)
        expect(result).to.be.equal(1)
      })

      it('should not call createElementCollection and return element CollectionId given element has CollectionId', () => {
        element.CollectionId = 3

        const result = collection.getCollectionIdFrom(element)

        expect(result).to.be.equal(3)
        expect(collection.createElementCollection.called).to.be.false
      })
    })

    describe('createElementCollection tests', () => {
      it('should increment 1 to id', () => {
        collection.createElementCollection()

        expect(collection.id).to.be.equal(1)
      })

      it('should add and init a new collection with new id as key', () => {
        const expectedCollection = {
          '1': {
            [Collection.MANIPULATION]: {},
            [Collection.EVENT]: {}
          }
        }
        collection.createElementCollection()

        expect(collection.data).to.be.eql(expectedCollection)
      })

      it('should return new id', () => {
        const result = collection.createElementCollection()

        expect(result).to.be.equal(1)
      })
    })

    /*************************/
    /*   getCollectionGroup  */
    /*************************/

    describe('getCollectionGroup tests', () => {
      const id = 1

      beforeEach(() => {
        collection.data = {
          '1': {
            [Collection.MANIPULATION]: {},
            [Collection.EVENT]: {}
          }
        }
      })

      it('should return the group from collection data indexed by given id and type', () => {
        const type = Collection.EVENT

        const result = collection.getCollectionGroup(id, type)

        expect(result).to.be.equal(collection.data[id][type])
      })

      it('should return the group from collection data indexed by given id and type', () => {
        const type = Collection.MANIPULATION

        const result = collection.getCollectionGroup(id, type)

        expect(result).to.be.equal(collection.data[id][type])
      })
    })

    /*************************/
    /*      getKeyFrom       */
    /*************************/

    describe('getKeyFrom tests', () => {
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
        const result = collection.getKeyFrom(info)

        expect(result).to.be.equal('script.js:2:10')
      })
    })

    /****************************/
    /* addCodeToCollectionGroup */
    /****************************/

    describe('addCodeToCollectionGroup tests', () => {
      const key = 'script.js:2:10'
      const code = 'code'
      let group

      beforeEach(() => {
        group = {}
      })

      it('should set {key: code} to group get from getCollectionGroup given key not exists in it', () => {
        collection.addCodeToCollectionGroup(group, key, code)

        expect(Object.keys(group).length).to.be.equal(1)
        expect(group[key]).to.be.equal(code)
      })

      it('should not set {key: code} to group get from getCollectionGroup given key exists in it', () => {
        group[key] = 'other code'

        collection.addCodeToCollectionGroup(group, key, code)

        expect(Object.keys(group).length).to.be.equal(1)
        expect(group[key]).to.be.equal('other code')
      })
    })
  })
})
