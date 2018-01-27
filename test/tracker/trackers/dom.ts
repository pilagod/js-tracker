import { expect } from 'chai'

import ActionType from '../../../src/tracker/public/ActionType'
import * as utils from './utils'

describe('HTML DOM API tracker', () => {
  const receiver = new utils.TrackerMessageReceiver(window)

  before(() => {
    receiver.setup()
  })

  after(() => {
    receiver.teardown()
  })

  beforeEach(() => {
    receiver.reset()
  })

  describe('Window', () => {
    it('should have owner \'window-info\' element on page', () => {
      const windowInfoElement = document.getElementsByTagName('window-info')[0]
      const ownerElement = utils.getOwnerOf(window).getElement()

      expect(windowInfoElement).to.be.not.undefined
      expect(ownerElement).to.equal(windowInfoElement)
    })
  })

  describe('Document', () => {
    it('should have owner \'document-info\' element on page', () => {
      const documentInfoElement = document.getElementsByTagName('document-info')[0]
      const ownerElement = utils.getOwnerOf(document).getElement()

      expect(documentInfoElement).to.be.not.undefined
      expect(ownerElement).to.equal(documentInfoElement)
    })
  })

  describe('DocumentFragment', () => {
    it('should not track any action on fragment', () => {
      const div = document.createElement('div')
      const fragment = document.createDocumentFragment()

      fragment.appendChild(div)
      const loc = utils.getPrevLineSourceLocation()

      receiver.verifyOnlyWrapMessageStream(loc)
    })

    it('should track other element appending a fragment', () => {
      const div = document.createElement('div')
      const fragment = document.createDocumentFragment()

      fragment.appendChild(document.createElement('div'))
      // @NOTE: although there is no records about fragment, 
      // it will still send record_start and record_end messages
      receiver.reset()

      div.appendChild(fragment)
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Node)
      const ownerID = utils.getOwnerOf(div).getTrackID()

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessageStream(loc, record)
    })
  })

  describe('HTMLElement', () => {
    it('should track its property assignment', () => {
      const div = document.createElement('div')

      div.accessKey = 'accessKey'
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Attr)
      const ownerID = utils.getOwnerOf(div).getTrackID()

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessageStream(loc, record)
    })

    it('should track its method call', () => {
      const div = document.createElement('div')

      div.click()
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Behav)
      const ownerID = utils.getOwnerOf(div).getTrackID()

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessageStream(loc, record)
    })
  })

  describe('Element', () => {
    it('should track its property assignment', () => {
      const div = document.createElement('div')

      div.id = 'id'
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Attr)
      const ownerID = utils.getOwnerOf(div).getTrackID()

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessageStream(loc, record)
    })

    it('should track its method call', () => {
      const div = document.createElement('div')
      const div2 = document.createElement('div')

      div.insertAdjacentElement('afterbegin', div2)
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Node)
      const ownerID = utils.getOwnerOf(div).getTrackID()

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessageStream(loc, record)
    })

    /* composite actions */

    describe('set/removeAttribute', () => {
      it('should track setAttribute', () => {
        const div = document.createElement('div')

        div.setAttribute('id', 'id')
        const loc = utils.getPrevLineSourceLocation()
        const record = utils.createRecord('1', ActionType.Attr)
        const ownerID = utils.getOwnerOf(div).getTrackID()

        expect(ownerID).to.equal(record.trackid)
        receiver.verifyMessageStream(loc, record)
      })

      it('should track removeAttribute', () => {
        const div = document.createElement('div')

        div.setAttribute('id', 'id')
        receiver.reset()

        div.removeAttribute('id')
        const loc = utils.getPrevLineSourceLocation()
        const record = utils.createRecord('1', ActionType.Attr)
        const ownerID = utils.getOwnerOf(div).getTrackID()

        expect(ownerID).to.equal(record.trackid)
        receiver.verifyMessageStream(loc, record)
      })

      it('should track removeAttributeNode', () => {
        const div = document.createElement('div')

        div.setAttribute('id', 'id')
        receiver.reset()

        div.removeAttributeNode(div.getAttributeNode('id'))
        const loc = utils.getPrevLineSourceLocation()
        const record = utils.createRecord('1', ActionType.Attr)
        const ownerID = utils.getOwnerOf(div).getTrackID()

        expect(ownerID).to.equal(record.trackid)
        receiver.verifyMessageStream(loc, record)
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
        const record = utils.createRecord('1', ActionType.Attr)
        const ownerID = utils.getOwnerOf(div).getTrackID()

        expect(ownerID).to.equal(record.trackid)
        receiver.verifyMessageStream(loc, record)
      })

      it('should track setAttributeNode{NS} (merge scenario)', () => {
        const div = document.createElement('div')
        const idAttr = document.createAttribute('id')

        idAttr.value = 'id' // trackid 1 attach to shadow element
        receiver.reset()

        div.setAttributeNode(idAttr) // trackid 2 attach to div
        const loc = utils.getPrevLineSourceLocation()
        const record = utils.createRecord('2', ActionType.Attr, '1')
        const ownerID = utils.getOwnerOf(div).getTrackID()

        expect(ownerID).to.equal(record.trackid)
        receiver.verifyMessageStream(loc, record)
      })

      it('should track setAttributeNode{NS} (error scenario)', () => {
        const div = document.createElement('div')
        const div2 = document.createElement('div')

        div.id = 'id'
        receiver.reset()

        const error = () => div2.setAttributeNode(div.attributes[0])
        const loc = utils.getPrevLineSourceLocation()

        expect(error).to.throw()
        receiver.verifyOnlyWrapMessageStream(loc)
      })
    })
  })

  describe('Node', () => {
    it('should track its property assignment', () => {
      const div = document.createElement('div')

      div.textContent = 'content'
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Attr | ActionType.Node)
      const ownerID = utils.getOwnerOf(div).getTrackID()

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessageStream(loc, record)
    })

    it('should track its method call', () => {
      const div = document.createElement('div')
      const div2 = document.createElement('div')

      div.appendChild(div2)
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Node)
      const ownerID = utils.getOwnerOf(div).getTrackID()

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessageStream(loc, record)
    })
  })

  describe('EventTarget', () => {
    it('should track its method call', () => {
      const div = document.createElement('div')

      div.addEventListener('click', () => { })
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Event)
      const ownerID = utils.getOwnerOf(div).getTrackID()

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessageStream(loc, record)
    })
  })

  describe('Attr', () => {
    it('should track its property assignment', () => {
      const idAttr = document.createAttribute('id')

      idAttr.value = 'id'
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Attr)
      const ownerID = utils.getOwnerOf(idAttr).getTrackID()

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessageStream(loc, record)
    })
  })

  describe('CSSStyleDeclaration', () => {
    it('should set its owner properly', () => {
      const div = document.createElement('div')

      expect(
        utils.getOwnerOf(div.style).getElement()
      ).to.equal(div)
    })

    it('should track its property assignment', () => {
      const div = document.createElement('div')

      div.style.color = 'red'
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Style)
      const ownerID = utils.getOwnerOf(div.style).getTrackID()

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessageStream(loc, record)
    })
  })

  describe('DOMStringMap', () => {
    it('should set its owner properly', () => {
      const div = document.createElement('div')

      expect(
        utils.getOwnerOf(div.dataset).getElement()
      ).to.equal(div)
    })

    it('should track its property assignment', () => {
      const div = document.createElement('div')

      div.dataset.data = 'data'
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Attr)
      const ownerID = utils.getOwnerOf(div.dataset).getTrackID()

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessageStream(loc, record)
    })
  })

  describe('DOMTokenList', () => {
    it('should set owner properly', () => {
      const div = document.createElement('div')

      expect(
        utils.getOwnerOf(div.classList).getElement()
      ).to.equal(div)
    })

    it('should track its value property assignment', () => {
      const div = document.createElement('div')

      div.classList.value = 'class'
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Style)
      const ownerID = utils.getOwnerOf(div.classList).getTrackID()

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessageStream(loc, record)
    })

    it('should track its methods', () => {
      const div = document.createElement('div')

      div.classList.add('class')
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Style)
      const ownerID = utils.getOwnerOf(div.classList).getTrackID()

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessageStream(loc, record)
    })
  })

  describe('NamedNodeMap', () => {
    it('should set its owner properly', () => {
      const div = document.createElement('div')

      expect(
        utils.getOwnerOf(div.attributes).getElement()
      ).to.equal(div)
    })

    it('should track removeNamedItem (attr scenario)', () => {
      const div = document.createElement('div')

      div.id = 'id'
      receiver.reset()

      div.attributes.removeNamedItem('id')
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Attr)
      const ownerID = utils.getOwnerOf(div.attributes).getTrackID()

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessageStream(loc, record)
    })

    it('should track removeNamedItem (style scenario)', () => {
      const div = document.createElement('div')

      div.style.color = 'red'
      receiver.reset()

      div.attributes.removeNamedItem('style')
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Style)
      const ownerID = utils.getOwnerOf(div.attributes).getTrackID()

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessageStream(loc, record)
    })

    /* anomalies */

    it('should track setNamedItem (attr scenario)', () => {
      const div = document.createElement('div')
      const id = document.createAttribute('id')

      id.value = 'id' // trackid 1 attach to shadow element
      receiver.reset()

      div.attributes.setNamedItem(id) // trackid 2 attach to owner of attributes
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('2', ActionType.Attr, '1')
      const ownerID = utils.getOwnerOf(div.attributes).getTrackID()

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessageStream(loc, record)
    })

    it('should track setNamedItem (style scenario)', () => {
      const div = document.createElement('div')
      const style = document.createAttribute('style')

      style.value = 'color: red' // trackid 1 attach to shadow element
      receiver.reset()

      div.attributes.setNamedItem(style) // trackid 2 attach to owner of attributes
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('2', ActionType.Style, '1')
      const ownerID = utils.getOwnerOf(div.attributes).getTrackID()

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessageStream(loc, record)
    })
  })
})