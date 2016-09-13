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
        // sandbox.stub(collection, 'stubElementIfNeeded', function (element) {
        //   return `stub${element}`
        // })
        sandbox.stub(collection, 'addInfoToElement')
      })

      // it('should call stubElementIfNeeded each iteration with element and type', () => {
      //   collection.addInfoToElements(data)
      //
      //   for (const [index, element] of elements.entries()) {
      //     expect(
      //       collection.stubElementIfNeeded
      //         .getCall(index)
      //           .calledWithExactly(element, type)
      //     ).to.be.true
      //   }
      // })

      it('should call addInfoToElement each iteration with an object containing each element, type and info', () => {
        collection.addInfoToElements(data)

        for (const [index, element] of elements.entries()) {
          const addInfoToElementCall =
            collection.addInfoToElement.getCall(index)

          // expect(
          //   addInfoToElementCall
          //     .calledAfter(collection.stubElementIfNeeded.getCall(index))
          // ).to.be.true
          expect(
            addInfoToElementCall
              .calledWithExactly({
                // element: `stub${elements[index]}`,
                element, type, info
              })
          ).to.be.true
        }
      })
    })

    /*************************/
    /*  stubElementIfNeeded  */
    /*************************/

    // describe('stubElementIfNeeded tests', () => {
    //   const element = {}
    //
    //   beforeEach(() => {
    //     sandbox.stub(collection, 'isNeededToStub')
    //     sandbox.stub(collection, 'stubElement')
    //   })
    //
    //   it('should return from stubElement called with element given type is Collection.EVENT and isNeededToStub called with element returns true', () => {
    //     collection.isNeededToStub.withArgs(element).returns(true)
    //     collection.stubElement.returns('resultFromStubElement')
    //
    //     const result = collection.stubElementIfNeeded(element, Collection.EVENT)
    //
    //     expect(
    //       collection.stubElement
    //         .calledWithExactly(element)
    //     ).to.be.true
    //     expect(result).to.be.equal('resultFromStubElement')
    //   })
    //
    //   it('should not call stubElement and return element given type is not Collection.EVENT', () => {
    //     const result = collection.stubElementIfNeeded(element, Collection.MANIPULATION)
    //
    //     expect(collection.stubElement.called).to.be.false
    //     expect(result).to.be.equal(element)
    //   })
    //
    //   it('should not call stubElement given isNeededToStub returns false', () => {
    //     collection.isNeededToStub.withArgs(element).returns(false)
    //
    //     const result = collection.stubElementIfNeeded(element, Collection.EVENT)
    //
    //     expect(collection.stubElement.called).to.be.false
    //     expect(result).to.be.equal(element)
    //   })
    // })

    /*************************/
    /*     isNeededToStub    */
    /*************************/

    // describe('isNeededToStub tests', () => {
    //   let element
    //
    //   beforeEach(() => {
    //     element = {
    //       dataset: {}
    //     }
    //   })
    //
    //   beforeEach(() => {
    //     sandbox.stub(collection, 'isEventEmpty')
    //   })
    //
    //   it('should return false given element has no parentNode', () => {
    //     const result = collection.isNeededToStub(element)
    //
    //     expect(result).to.be.false
    //   })
    //
    //   it('should return false given element.dataset has collectionId and isEventEmpty called with collectionId returns false', () => {
    //     element.parentNode = {}
    //     element.dataset.collectionId = 1
    //     collection.isEventEmpty.withArgs(1).returns(false)
    //
    //     const result = collection.isNeededToStub(element)
    //
    //     expect(result).to.be.false
    //   })
    //
    //   it('should return true given element has parentNode and its dataset has no collectionId', () => {
    //     element.parentNode = {}
    //
    //     const result = collection.isNeededToStub(element)
    //
    //     expect(result).to.be.true
    //   })
    //
    //   it('should return true given element has parentNode and its dataset has collectionId but isEventEmpty returns true', () => {
    //     element.parentNode = {}
    //     element.dataset.collectionId = 1
    //     collection.isEventEmpty.withArgs(1).returns(true)
    //
    //     const result = collection.isNeededToStub(element)
    //
    //     expect(result).to.be.true
    //   })
    // })

    /*************************/
    /*     isEventEmpty      */
    /*************************/

    // describe('isEventEmpty tests', () => {
    //   const collectionId = 1
    //
    //   it('should return true when given id\'s EVENT group is empty', () => {
    //     collection.data = {
    //       '1': {
    //         [Collection.EVENT]: {}
    //       }
    //     }
    //     const result = collection.isEventEmpty(collectionId)
    //
    //     expect(result).to.be.true
    //   })
    //
    //   it('should return false given id\'s EVENT group is not empty', () => {
    //     collection.data = {
    //       '1': {
    //         [Collection.EVENT]: {
    //           key: 'code'
    //         }
    //       }
    //     }
    //     const result = collection.isEventEmpty(collectionId)
    //
    //     expect(result).to.be.false
    //   })
    // })

    /*************************/
    /*      stubElement      */
    /*************************/

    // describe('stubElement tests', () => {
    //   let element, childNodes, stubElement
    //
    //   beforeEach(() => {
    //     childNodes = ['element1', 'element2', 'element3']
    //     stubElement = {
    //       appendChild: sandbox.spy((child) => {
    //         childNodes.splice(childNodes.indexOf(child), 1)
    //       })
    //     }
    //     element = {
    //       cloneNode: sandbox.stub().returns(stubElement),
    //       childNodes,
    //       parentNode: {
    //         replaceChild: sandbox.spy()
    //       }
    //     }
    //   })
    //
    //   it('should call cloneNode of given element', () => {
    //     collection.stubElement(element)
    //
    //     expect(element.cloneNode.calledWith()).to.be.true
    //   })
    //
    //   it('should call appendChild of stub element with each childNodes of given element', () => {
    //     collection.stubElement(element)
    //
    //     for (let i = 0; i < 3; i += 1) {
    //       expect(
    //         stubElement.appendChild
    //           .getCall(i)
    //             .calledWithExactly(`element${i + 1}`)
    //       ).to.be.true
    //     }
    //   })
    //
    //   it('should call replaceChild of element.parentNode with stubElement and element', () => {
    //     const parentNode = element.parentNode
    //
    //     collection.stubElement(element)
    //
    //     expect(
    //       parentNode.replaceChild
    //         .calledAfter(element.cloneNode)
    //     ).to.be.true
    //     expect(
    //       parentNode.replaceChild
    //         .calledAfter(stubElement.appendChild)
    //     ).to.be.true
    //     expect(childNodes).to.be.eql([])
    //     expect(
    //       parentNode.replaceChild
    //         .calledWithExactly(stubElement, element)
    //     ).to.be.true
    //   })
    //
    //   it('should return stub element', () => {
    //     const result = collection.stubElement(element)
    //
    //     expect(result).to.be.equal(stubElement)
    //   })
    // })

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
