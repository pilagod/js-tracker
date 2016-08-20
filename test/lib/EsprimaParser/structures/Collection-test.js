describe('Collection tests', () => {
  let Collection, CallChecker

  before(() => {
    Collection = require('../../../../lib/EsprimaParser/structures/Collection')
    CallChecker = require('../../../../lib/EsprimaParser/structures/CallChecker')
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

  describe('methods tests', () => {
    let collection

    beforeEach(() => {
      collection = new Collection()
    })

    describe('addEvent tests', () => {
      const elements = ['element1', 'element2', 'element3']
      const info = {}

      beforeEach(() => {
        sandbox.stub(collection, 'addFromElements')
      })

      it('should call addFromElements with given elements, info and type CallChecker.EVENT', () => {
        collection.addEvent(elements, info)

        expect(
          collection.addFromElements
            .calledWithExactly(elements, info, CallChecker.EVENT)
        ).to.be.true
      })
    })

    describe('addManipulation tests', () => {
      const elements = ['element1', 'element2', 'element3']
      const info = {}

      beforeEach(() => {
        sandbox.stub(collection, 'addFromElements')
      })

      it('should call addFromElements with given elements, info and type CallChecker.MANIPULATION', () => {
        collection.addManipulation(elements, info)

        expect(
          collection.addFromElements
            .calledWithExactly(elements, info, CallChecker.MANIPULATION)
        ).to.be.true
      })
    })

    describe('addFromElements tests', () => {
      const elements = ['element1', 'element2', 'element3']
      const info = {}
      const type = 'type'

      beforeEach(() => {
        sandbox.stub(collection, 'add')
      })

      it('should call add with each element and info and type', () => {
        collection.addFromElements(elements, info, type)

        for (const [index, element] of elements.entries()) {
          expect(
            collection.add
              .getCall(index)
                .calledWithExactly(elements[index], info, type)
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

      beforeEach(() => {
        sandbox.stub(collection, 'getKeyFromInfo')
          .returns('resultFromGetKeyFromInfo')
        sandbox.stub(collection, 'getCollectionIdOnElement')
          .returns('resultFromGetCollectionIdOnElement')
        sandbox.stub(collection, 'addCodeToCollectionData')
      })

      it('should call getKeyFromInfo with info', () => {
        collection.add(element, info, type)

        expect(
          collection.getKeyFromInfo
            .calledWithExactly(info)
        ).to.be.true
      })

      it('should call getCollectionIdOnElement with element', () => {
        collection.add(element, info, type)

        expect(
          collection.getCollectionIdOnElement
            .calledWithExactly(element)
        ).to.be.true
      })

      it('should call addCodeToCollectionData with an object containing id from getCollectionIdOnElement, key from getKeyFromInfo, code from info and type', () => {
        collection.add(element, info, type)

        expect(
          collection.addCodeToCollectionData
            .calledWithExactly({
              id: 'resultFromGetCollectionIdOnElement',
              key: 'resultFromGetKeyFromInfo',
              code: info.code,
              type
            })
        ).to.be.true
      })
    })

    describe('getCollectionIdOnElement tests', () => {
      let element

      beforeEach(() => {
        element = {}

        sandbox.stub(collection, 'createElementCollection')
      })

      it('should call createElementCollection given element has no CollectionId', () => {
        collection.getCollectionIdOnElement(element)

        expect(collection.createElementCollection.called).to.be.true
      })

      it('should set element CollectionId to the result from createElementCollection and return given element has no CollectionId', () => {
        collection.createElementCollection.returns(1)

        const result = collection.getCollectionIdOnElement(element)

        expect(element.CollectionId).to.be.equal(1)
        expect(result).to.be.equal(1)
      })

      it('should not call createElementCollection and return element CollectionId given element has CollectionId', () => {
        element.CollectionId = 3

        const result = collection.getCollectionIdOnElement(element)

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
            [CallChecker.MANIPULATION]: {},
            [CallChecker.EVENT]: {}
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

    describe('getKeyFromInfo tests', () => {
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
        const result = collection.getKeyFromInfo(info)

        expect(result).to.be.equal('script.js:2:10')
      })
    })

    describe('addCodeToCollectionData tests', () => {
      let data, groupStub

      beforeEach(() => {
        groupStub = {}
        data = {
          id: 1,
          type: CallChecker.EVENT,
          key: 'script.js:2:10',
          code: 'code'
        }
        sandbox.stub(collection, 'getCollectionGroup')
          .returns(groupStub)
      })

      it('should call getCollectionGroup with id and type', () => {
        collection.addCodeToCollectionData(data)

        expect(
          collection.getCollectionGroup
            .calledWithExactly(data.id, data.type)
        ).to.be.true
      })

      it('should set {key: code} to group get from getCollectionGroup given key not exists in it', () => {
        collection.addCodeToCollectionData(data)

        expect(Object.keys(groupStub).length).to.be.equal(1)
        expect(groupStub[data.key]).to.be.equal(data.code)
      })

      it('should not set {key: code} to group get from getCollectionGroup given key exists in it', () => {
        groupStub[data.key] = 'other code'

        collection.addCodeToCollectionData(data)

        expect(Object.keys(groupStub).length).to.be.equal(1)
        expect(groupStub[data.key]).to.be.equal('other code')
      })
    })

    describe('getCollectionGroup tests', () => {
      const id = 1

      beforeEach(() => {
        collection.data = {
          '1': {
            [CallChecker.MANIPULATION]: {},
            [CallChecker.EVENT]: {}
          }
        }
      })

      it('should return group from collection data by given id and type', () => {
        const type = CallChecker.EVENT

        const result = collection.getCollectionGroup(id, type)

        expect(result).to.be.equal(collection.data[id][type])
      })

      it('should return group from collection data by given id and type', () => {
        const type = CallChecker.MANIPULATION

        const result = collection.getCollectionGroup(id, type)

        expect(result).to.be.equal(collection.data[id][type])
      })
    })
  })
})
