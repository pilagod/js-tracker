import { expect } from 'chai'

import ActionType from '../../../src/tracker/public/ActionType'
import OwnerManager from '../../../src/tracker/private/OwnerManager'
import * as utils from './utils'

/* this test is based on dom tracker initialized in__init__.ts */

describe('HTML DOM API tracker', () => {
  const receiver = new utils.TrackerMessageReceiver(window)
  const svgns = 'http://www.w3.org/2000/svg'

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
      const ownerElement = OwnerManager.getOwnerElement(window)

      expect(windowInfoElement).to.be.not.undefined
      expect(ownerElement).to.equal(windowInfoElement)
    })

    it('should track method call (e.g., addEventListener) as from window given no explicit target', () => {
      addEventListener('click', () => { })
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Event)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(window)

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessages(loc, record)
    })
  })

  describe('Document', () => {
    it('should have owner \'document-info\' element on page', () => {
      const documentInfoElement = document.getElementsByTagName('document-info')[0]
      const ownerElement = OwnerManager.getOwnerElement(document)

      expect(documentInfoElement).to.be.not.undefined
      expect(ownerElement).to.equal(documentInfoElement)
    })
  })

  describe('DocumentFragment', () => {
    it('should not track any action on fragment', () => {
      const div = document.createElement('div')
      const fragment = document.createDocumentFragment()

      fragment.appendChild(div)

      receiver.verifyNoMessage()
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
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessages(loc, record)
    })
  })

  describe('HTMLElement', () => {
    it('should track its property assignment', () => {
      const div = document.createElement('div')

      div.accessKey = 'accessKey'
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Attr)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessages(loc, record)
    })

    /* anomalies */

    it('should track behavior (e.g., click, focus) and actions triggered by it properly', () => {
      const div1 = document.createElement('div')
      const div2 = document.createElement('div')

      div2.addEventListener('click', () => {
        div1.style.color = 'red'
      })
      const loc1 = utils.getPrevLineSourceLocation(-1)
      const record1 = utils.createRecord('2', ActionType.Style)

      receiver.reset()

      div2.click()
      const loc2 = utils.getPrevLineSourceLocation()
      const record2 = utils.createRecord('1', ActionType.Behav | ActionType.Event)

      const ownerID1 = OwnerManager.getTrackIDFromItsOwner(div1.style)
      const ownerID2 = OwnerManager.getTrackIDFromItsOwner(div2)

      expect(ownerID1).to.equal(record1.trackid)
      expect(ownerID2).to.equal(record2.trackid)
      receiver.verifyListOfMessages([
        { loc: loc1, data: record1 },
        { loc: loc2, data: record2 }
      ])
    })
  })

  describe('SVGElement', () => {
    it('should track its property assignment', () => {
      const svg = document.createElementNS(svgns, 'svg');

      (<any>svg).tabIndex = 1
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Attr)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(svg)

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessages(loc, record)
    })

    it('should track its method call', () => {
      const svg = document.createElementNS(svgns, 'svg');

      (<any>svg).focus()
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Behav | ActionType.Event)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(svg)

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessages(loc, record)
    })
  })

  describe('Element', () => {
    it('should track its property assignment', () => {
      const div = document.createElement('div')

      div.id = 'id'
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Attr)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessages(loc, record)
    })

    it('should track its method call', () => {
      const div = document.createElement('div')
      const div2 = document.createElement('div')

      div.insertAdjacentElement('afterbegin', div2)
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Node)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessages(loc, record)
    })

    /* composite actions */

    describe('set/removeAttribute', () => {
      it('should track setAttribute', () => {
        const div = document.createElement('div')

        div.setAttribute('id', 'id')
        const loc = utils.getPrevLineSourceLocation()
        const record = utils.createRecord('1', ActionType.Attr)
        const ownerID = OwnerManager.getTrackIDFromItsOwner(div)

        expect(ownerID).to.equal(record.trackid)
        receiver.verifyMessages(loc, record)
      })

      it('should track removeAttribute', () => {
        const div = document.createElement('div')

        div.setAttribute('id', 'id')
        receiver.reset()

        div.removeAttribute('id')
        const loc = utils.getPrevLineSourceLocation()
        const record = utils.createRecord('1', ActionType.Attr)
        const ownerID = OwnerManager.getTrackIDFromItsOwner(div)

        expect(ownerID).to.equal(record.trackid)
        receiver.verifyMessages(loc, record)
      })

      it('should track removeAttributeNode', () => {
        const div = document.createElement('div')

        div.setAttribute('id', 'id')
        receiver.reset()

        div.removeAttributeNode(div.getAttributeNode('id'))
        const loc = utils.getPrevLineSourceLocation()
        const record = utils.createRecord('1', ActionType.Attr)
        const ownerID = OwnerManager.getTrackIDFromItsOwner(div)

        expect(ownerID).to.equal(record.trackid)
        receiver.verifyMessages(loc, record)
      })
    })

    /* anomalies */

    describe('setAttributeNode{NS}', () => {
      // @NOTE: setAttributeNode & NS are identical, only test Node here
      it('should track setAttributeNode{NS} (basic scenario)', () => {
        const div = document.createElement('div')
        const idAttr = document.createAttribute('id')

        div.setAttributeNode(idAttr)
        const loc = utils.getPrevLineSourceLocation()
        const record = utils.createRecord('1', ActionType.Attr)
        const ownerID = OwnerManager.getTrackIDFromItsOwner(div)

        expect(ownerID).to.equal(record.trackid)
        receiver.verifyMessages(loc, record)
      })

      it('should track setAttributeNode{NS} (merge scenario)', () => {
        const div = document.createElement('div')
        const idAttr = document.createAttribute('id')

        idAttr.value = 'id' // trackid 1 attach to shadow element
        receiver.reset()

        div.setAttributeNode(idAttr) // trackid 2 attach to div
        const loc = utils.getPrevLineSourceLocation()
        const record = utils.createRecord('2', ActionType.Attr, '1')
        const ownerID = OwnerManager.getTrackIDFromItsOwner(div)

        expect(ownerID).to.equal(record.trackid)
        receiver.verifyMessages(loc, record)
      })

      it('should track setAttributeNode{NS} (attr has no value scenario)', () => {
        const div = document.createElement('div')
        const idAttr = document.createAttribute('id')

        // pre-set trackid on div, for more details, please checkout 
        // [src/tracker/trackers/dom/trackerHelpers.ts] decorators.setAttributeNode
        div.accessKey = 'accessKey'
        receiver.reset()

        // test set no owner attribute
        div.setAttributeNode(idAttr)
        const loc1 = utils.getPrevLineSourceLocation()
        const record1 = utils.createRecord('1', ActionType.Attr)
        const ownerID1 = OwnerManager.getTrackIDFromItsOwner(div)

        expect(ownerID1).to.equal(record1.trackid)
        receiver.verifyMessages(loc1, record1)

        receiver.reset()

        // test set value after attach to element
        idAttr.value = 'id'
        const loc2 = utils.getPrevLineSourceLocation()
        const record2 = utils.createRecord('1', ActionType.Attr)
        const ownerID2 = OwnerManager.getTrackIDFromItsOwner(idAttr)

        expect(ownerID2).to.equal(record2.trackid)
        receiver.verifyMessages(loc2, record2)
      })

      it('should not track setAttributeNode{NS} (error scenario)', () => {
        const div = document.createElement('div')
        const div2 = document.createElement('div')

        div.id = 'id'
        receiver.reset()

        const error = () => div2.setAttributeNode(div.attributes[0])

        expect(error).to.throw()
        receiver.verifyNoMessage()
      })
    })
  })

  describe('Node', () => {
    it('should track its property assignment', () => {
      const div = document.createElement('div')

      div.textContent = 'content'
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Attr | ActionType.Node)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessages(loc, record)
    })

    it('should track its method call', () => {
      const div = document.createElement('div')
      const div2 = document.createElement('div')

      div.appendChild(div2)
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Node)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessages(loc, record)
    })
  })

  describe('EventTarget', () => {
    it('should track its method call', () => {
      const div = document.createElement('div')

      div.addEventListener('click', () => { })
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Event)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessages(loc, record)
    })

    /* anomalies */

    it('should track dispatchEvent and actions triggered by it properly', () => {
      const div = document.createElement('div')

      div.addEventListener('click', () => {
        div.style.color = 'red'
      })
      const loc1 = utils.getPrevLineSourceLocation(-1)
      const record1 = utils.createRecord('1', ActionType.Style)

      receiver.reset()

      div.dispatchEvent(new Event('click'))
      const loc2 = utils.getPrevLineSourceLocation()
      const record2 = utils.createRecord('1', ActionType.Behav | ActionType.Event)

      const ownerID1 = OwnerManager.getTrackIDFromItsOwner(div.style)
      const ownerID2 = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID1).to.equal(record1.trackid)
      expect(ownerID2).to.equal(record2.trackid)
      receiver.verifyListOfMessages([
        { loc: loc1, data: record1 },
        { loc: loc2, data: record2 }
      ])
    })
  })

  describe('Attr', () => {
    it('should track its property assignment', () => {
      const idAttr = document.createAttribute('id')

      idAttr.value = 'id'
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Attr)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(idAttr)

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessages(loc, record)
    })
  })

  describe('CSSStyleDeclaration', () => {
    it('should set HTMLElement owner properly', () => {
      const div = document.createElement('div')

      expect(
        OwnerManager.getOwnerElement(div.style)
      ).to.equal(div)
    })

    it('should set SVGElement owner properly', () => {
      const svg = document.createElementNS(svgns, 'svg')

      expect(
        OwnerManager.getOwnerElement(svg.style)
      ).to.equal(svg)
    })

    it('should track HTMLElement owner style property assignment', () => {
      const div = document.createElement('div')

      div.style.color = 'red'
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Style)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div.style)

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessages(loc, record)
    })

    it('should track SVGElement owner style property assignment', () => {
      const svg = document.createElementNS(svgns, 'svg')

      svg.style.color = 'red'
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Style)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(svg.style)

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessages(loc, record)
    })
  })

  describe('DOMStringMap', () => {
    it('should set its owner properly', () => {
      const div = document.createElement('div')

      expect(
        OwnerManager.getOwnerElement(div.dataset)
      ).to.equal(div)
    })

    it('should track its property assignment', () => {
      const div = document.createElement('div')

      div.dataset.data = 'data'
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Attr)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div.dataset)

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessages(loc, record)
    })
  })

  describe('DOMTokenList', () => {
    it('should set owner properly', () => {
      const div = document.createElement('div')

      expect(
        OwnerManager.getOwnerElement(div.classList)
      ).to.equal(div)
    })

    it('should track its value property assignment', () => {
      const div = document.createElement('div')

      div.classList.value = 'class'
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Style)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div.classList)

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessages(loc, record)
    })

    it('should track its methods', () => {
      const div = document.createElement('div')

      div.classList.add('class')
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Style)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div.classList)

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessages(loc, record)
    })
  })

  describe('NamedNodeMap', () => {
    it('should set its owner properly', () => {
      const div = document.createElement('div')

      expect(
        OwnerManager.getOwnerElement(div.attributes)
      ).to.equal(div)
    })

    it('should track removeNamedItem (attr scenario)', () => {
      const div = document.createElement('div')

      div.id = 'id'
      receiver.reset()

      div.attributes.removeNamedItem('id')
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Attr)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div.attributes)

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessages(loc, record)
    })

    it('should track removeNamedItem (style scenario)', () => {
      const div = document.createElement('div')

      div.style.color = 'red'
      receiver.reset()

      div.attributes.removeNamedItem('style')
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Style)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div.attributes)

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessages(loc, record)
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
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div.attributes)

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessages(loc, record)
    })

    it('should track setNamedItem (style scenario)', () => {
      const div = document.createElement('div')
      const style = document.createAttribute('style')

      style.value = 'color: red' // trackid 1 attach to shadow element
      receiver.reset()

      div.attributes.setNamedItem(style) // trackid 2 attach to owner of attributes
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('2', ActionType.Style, '1')
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div.attributes)

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessages(loc, record)
    })
  })
})