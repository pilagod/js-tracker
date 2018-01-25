import { expect } from 'chai'
import * as sinon from 'sinon'

import ActionType from '../../src/tracker/public/ActionType'
import OwnerManager from '../../src/tracker/private/OwnerManager'
import {
  attachListenerTo,
  detachListenerFrom
} from '../../src/tracker/private/NativeUtils'

import * as utils from './utils'

describe('HTML DOM API tracker', () => {
  const {
    messages,
    resetMessages,
    trackerMessageHandler
  } = utils.makeTrackerMessageHandler()

  before(() => {
    attachListenerTo(window, 'js-tracker', trackerMessageHandler)
  })

  after(() => {
    detachListenerFrom(window, 'js-tracker', trackerMessageHandler)
  })

  beforeEach(() => {
    // @NOTE: https://stackoverflow.com/questions/1232040/how-do-i-empty-an-array-in-javascript
    // in order to keep reference of messages, we can only set length to 0
    resetMessages()
  })

  describe('Window', () => {
    it('should have owner \'window-info\' element on page', () => {
      const windowInfoElement =
        document.getElementsByTagName('window-info')[0]

      expect(windowInfoElement).to.be.not.undefined
      expect(
        OwnerManager
          .getOwner(window)
          .getOwnerElement()
      ).to.equal(windowInfoElement)
    })
  })

  describe('Document', () => {
    it('should have owner \'document-info\' element on page', () => {
      const documentInfoElement =
        document.getElementsByTagName('document-info')[0]

      expect(documentInfoElement).to.be.not.undefined
      expect(
        OwnerManager
          .getOwner(document)
          .getOwnerElement()
      ).to.equal(documentInfoElement)
    })
  })

  describe('DocumentFragment', () => {
    it('should not track any action on fragment', () => {
      const fragment = document.createDocumentFragment()

      fragment.appendChild(document.createElement('div'))

      expect(messages).to.have.length(0)
    })

    it('should track other element appending a fragment', () => {
      const div = document.createElement('div')
      const child = document.createElement('div')
      const fragment = document.createDocumentFragment()

      fragment.appendChild(child)

      div.appendChild(fragment)
      const loc = utils.getPrevLineSourceLocation()

      expect(messages).to.have.length(1)

      utils.matchActionInfo(messages[0], {
        caller: div,
        trackid: '1',
        type: ActionType.Node,
        loc
      })
    })
  })

  describe('HTMLElement', () => {
    it('should track its property assignment', () => {
      const div = document.createElement('div')

      div.accessKey = 'accessKey'
      const loc = utils.getPrevLineSourceLocation()

      expect(messages).to.have.length(1)

      utils.matchActionInfo(messages[0], {
        caller: div,
        trackid: '1',
        type: ActionType.Attr,
        loc
      })
    })

    it('should track its method call', () => {
      const div = document.createElement('div')

      div.click()
      const loc = utils.getPrevLineSourceLocation()

      expect(messages).to.have.length(1)

      utils.matchActionInfo(messages[0], {
        caller: div,
        trackid: '1',
        type: ActionType.Behav,
        loc
      })
    })
  })

  describe('Element', () => {
    it('should track its property assignment', () => {
      const div = document.createElement('div')

      div.id = 'id'
      const loc = utils.getPrevLineSourceLocation()

      expect(messages).to.have.length(1)

      utils.matchActionInfo(messages[0], {
        caller: div,
        trackid: '1',
        type: ActionType.Attr,
        loc
      })
    })

    it('should track its method call', () => {
      const div = document.createElement('div')
      const div2 = document.createElement('div')

      div.insertAdjacentElement('afterbegin', div2)
      const loc = utils.getPrevLineSourceLocation()

      expect(messages).to.have.length(1)

      utils.matchActionInfo(messages[0], {
        caller: div,
        trackid: '1',
        type: ActionType.Node,
        loc
      })
    })

    /* composite actions */

    describe('set/removeAttribute', () => {
      it('should track setAttribute', () => {
        const div = document.createElement('div')

        div.setAttribute('id', 'id')
        const loc = utils.getPrevLineSourceLocation()

        expect(messages).to.have.length(1)

        utils.matchActionInfo(messages[0], {
          caller: div,
          trackid: '1',
          type: ActionType.Attr,
          loc
        })
      })

      it('should track removeAttribute', () => {
        const div = document.createElement('div')

        div.setAttribute('id', 'id') // messages[0]
        div.removeAttribute('id') // messages[1]
        const loc = utils.getPrevLineSourceLocation()

        expect(messages).to.have.length(2)

        utils.matchActionInfo(messages[1], {
          caller: div,
          trackid: '1',
          type: ActionType.Attr,
          loc
        })
      })

      it('should track removeAttributeNode', () => {
        const div = document.createElement('div')

        div.setAttribute('id', 'id')
        div.removeAttributeNode(div.getAttributeNode('id'))
        const loc = utils.getPrevLineSourceLocation()

        expect(messages).to.have.length(2)

        utils.matchActionInfo(messages[1], {
          caller: div,
          trackid: '1',
          type: ActionType.Attr,
          loc
        })
      })
    })

    /* anomalies */

    // @NOTE: setAttributeNode & setAttributeNodeNS track behaviors
    // are identical, only test setAttributeNode here of two scenarios
    describe('setAttributeNode{NS}', () => {
      it('should track setAttributeNode{NS} (basic scenario)', () => {
        const div = document.createElement('div')
        const idAttr = document.createAttribute('id')

        div.setAttributeNode(idAttr)
        const loc = utils.getPrevLineSourceLocation()

        expect(messages).to.have.length(1)

        utils.matchActionInfo(messages[0], {
          caller: div,
          trackid: '1',
          type: ActionType.Attr,
          loc
        })
      })

      it('should track setAttributeNode{NS} (merge scenario)', () => {
        const div = document.createElement('div')
        const idAttr = document.createAttribute('id')

        idAttr.value = 'id' // messages[0] -> generate trackid 1

        div.setAttributeNode(idAttr) // messages[1] -> generate trackid 2
        const loc = utils.getPrevLineSourceLocation()

        expect(messages).to.have.length(2)

        utils.matchActionInfo(messages[1], {
          caller: div,
          trackid: '2',
          type: ActionType.Attr,
          merge: '1',
          loc
        })
      })

      it('should track setAttributeNode{NS} (error scenario)', () => {
        const div = document.createElement('div')
        const div2 = document.createElement('div')

        div.id = 'id'

        const error = () => {
          div2.setAttributeNode(div.attributes[0])
        }
        expect(error).to.throw()
        expect(messages).to.have.length(1)
      })
    })
  })

  describe('Node', () => {
    it('should track its property assignment', () => {
      const div = document.createElement('div')

      div.textContent = 'content'
      const loc = utils.getPrevLineSourceLocation()

      expect(messages).to.have.length(1)

      utils.matchActionInfo(messages[0], {
        caller: div,
        trackid: '1',
        type: ActionType.Attr | ActionType.Node,
        loc
      })
    })

    it('should track its method call', () => {
      const div = document.createElement('div')
      const div2 = document.createElement('div')

      div.appendChild(div2)
      const loc = utils.getPrevLineSourceLocation()

      expect(messages).to.have.length(1)

      utils.matchActionInfo(messages[0], {
        caller: div,
        trackid: '1',
        type: ActionType.Node,
        loc
      })
    })
  })

  describe('EventTarget', () => {
    it('should track its method call', () => {
      const div = document.createElement('div')

      div.addEventListener('click', () => { })
      const loc = utils.getPrevLineSourceLocation()

      expect(messages).to.have.length(1)

      utils.matchActionInfo(messages[0], {
        caller: div,
        trackid: '1',
        type: ActionType.Event,
        loc
      })
    })
  })

  describe('Attr', () => {
    it('should track its property assignment', () => {
      const idAttr = document.createAttribute('id')

      idAttr.value = 'id'
      const loc = utils.getPrevLineSourceLocation()

      expect(messages).to.have.length(1)

      utils.matchActionInfo(messages[0], {
        caller: idAttr,
        trackid: '1',
        type: ActionType.Attr,
        loc
      })
    })
  })

  describe('CSSStyleDeclaration', () => {
    it('should track its property assignment', () => {
      const div = document.createElement('div')

      expect(
        OwnerManager
          .getOwner(div.style)
          .getOwnerElement()
      ).to.equal(div)

      div.style.color = 'red'
      const loc = utils.getPrevLineSourceLocation()

      expect(messages).to.have.length(1)

      utils.matchActionInfo(messages[0], {
        caller: div.style,
        trackid: '1',
        type: ActionType.Style,
        loc
      })
    })
  })

  describe('DOMStringMap', () => {
    it('should track its property assignment', () => {
      const div = document.createElement('div')

      expect(
        OwnerManager
          .getOwner(div.dataset)
          .getOwnerElement()
      ).to.equal(div)

      div.dataset.data = 'data'
      const loc = utils.getPrevLineSourceLocation()

      expect(messages).to.have.length(1)

      utils.matchActionInfo(messages[0], {
        caller: div.dataset,
        trackid: '1',
        type: ActionType.Attr,
        loc
      })
    })
  })

  describe('DOMTokenList', () => {
    it('should track its value property assignment', () => {
      const div = document.createElement('div')

      div.classList.value = 'class'
      const loc = utils.getPrevLineSourceLocation()

      expect(messages).to.have.length(1)

      utils.matchActionInfo(messages[0], {
        caller: div.classList,
        trackid: '1',
        type: ActionType.Style,
        loc
      })
    })

    it('should track its methods', () => {
      const div = document.createElement('div')

      div.classList.add('class')
      const loc = utils.getPrevLineSourceLocation()

      expect(messages).to.have.length(1)

      utils.matchActionInfo(messages[0], {
        caller: div.classList,
        trackid: '1',
        type: ActionType.Style,
        loc
      })
    })
  })

  describe('NamedNodeMap', () => {
    it('should track removeNamedItem', () => {
      const div = document.createElement('div')

      div.id = 'id' // messages[0]

      div.attributes.removeNamedItem('id') // messages[1]
      const loc = utils.getPrevLineSourceLocation()

      expect(messages).to.have.length(2)

      utils.matchActionInfo(messages[1], {
        caller: div.attributes,
        trackid: '1',
        type: ActionType.Attr,
        loc
      })
    })

    /* anomalies */

    it('should track setNamedItem', () => {
      const div = document.createElement('div')
      const id = document.createAttribute('id')

      id.value = 'id' // messages[0] -> generate trackid 1

      div.attributes.setNamedItem(id) // messages[1] -> generate trackid 2
      const loc = utils.getPrevLineSourceLocation()

      expect(messages).to.have.length(2)

      utils.matchActionInfo(messages[1], {
        caller: div.attributes,
        trackid: '2',
        type: ActionType.Attr,
        loc,
      })
    })
  })
})