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

    describe('getCollectionIdOnElement tests', () => {
      it('should set CollectionId to (id + 1) on element given element has no CollectionId', () => {
        const element = {}

        collection.getCollectionIdOnElement(element)

        expect(collection.id).to.be.equal(1)
        expect(element.CollectionId).to.be.equal(1)
      })

      it('should init new id in collection data', () => {
        const element = {}

        collection.getCollectionIdOnElement(element)

        expect(Object.keys(collection.data).length).to.be.equal(1)
        expect(collection.data[collection.id]).to.be.eql({
          [CallChecker.MANIPULATION]: {},
          [CallChecker.EVENT]: {}
        })
      })

      it('should return element new CollectionId given element has no CollectionId before', () => {
        const element = {}

        const result = collection.getCollectionIdOnElement(element)

        expect(result).to.be.equal(1)
      })

      it('should return element CollectionId given element already has CollectionId', () => {
        const element = {
          CollectionId: 3
        }
        const result = collection.getCollectionIdOnElement(element)

        expect(result).to.be.equal(3)
      })
    })

    describe('addCodeToCollectionData tests', () => {
      let element, data

      beforeEach(() => {
        element = {}
        data = {
          type: CallChecker.EVENT,
          key: 'script.js:2:10',
          code: 'code'
        }
        data.id = collection.getCollectionIdOnElement(element)

        sandbox.stub(collection, 'getCollectionGroup')
          .returns({})
      })

      it('should call getCollectionGroup with id and type', () => {
        collection.addCodeToCollectionData(data)

        expect(
          collection.getCollectionGroup
            .calledWithExactly(data.id, data.type)
        ).to.be.true
      })

      it('should set {key: code} to group get from getCollectionGroup given key not exists in it', () => {
        const groupStub = collection.data[1][CallChecker.EVENT]

        collection.getCollectionGroup
          .returns(groupStub)

        collection.addCodeToCollectionData(data)

        expect(Object.keys(groupStub).length).to.be.equal(1)
        expect(groupStub[data.key]).to.be.equal(data.code)
      })

      it('should not set {key: code} to group get from getCollectionGroup given key exists in it', () => {
        const groupStub = collection.data[1][CallChecker.EVENT]

        groupStub[data.key] = 'other code'

        collection.getCollectionGroup
          .returns(groupStub)

        collection.addCodeToCollectionData(data)

        expect(Object.keys(groupStub).length).to.be.equal(1)
        expect(groupStub[data.key]).to.be.equal('other code')
      })
    })

    describe('getCollectionGroup tests', () => {
      let id, element

      beforeEach(() => {
        element = {}
        id = collection.getCollectionIdOnElement(element)
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
