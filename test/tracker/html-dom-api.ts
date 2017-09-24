import { expect } from 'chai'
import * as sinon from 'sinon'
import * as StackTrace from 'stacktrace-js'
import ActionType from '../../src/tracker/public/ActionType'
import OwnerManager from '../../src/tracker/private/OwnerManager'
import {
  attachListenerTo,
  detachListenerFrom
} from '../../src/tracker/private/NativeUtils'

describe('HTML DOM API tracker', () => {
  let msgs: ActionInfo[]

  const trackerListener = (event: CustomEvent) => {
    msgs.push(event.detail.info)
  }

  before(() => {
    // @NOTE: dispatch js-tracker info here will modify 
    // ActionStore in contentscript of contentscript tests,
    // but now contentscript test stub all ActionStore methods,
    // so it is not a problem currently.
    attachListenerTo(window, 'js-tracker', (event: CustomEvent) => {
      msgs.push(event.detail.info)
    })
  })

  after(() => {
    detachListenerFrom(window, 'js-tracker', trackerListener)
  })

  beforeEach(() => {
    msgs = []
  })

  type ExpectInfo = {
    caller: ActionTarget,
    trackid: string,
    type: ActionType,
    loc: SourceLocation,
    merge?: string,
  }

  function matchActionInfo(got: ActionInfo, expected: ExpectInfo) {
    expect(
      OwnerManager
        .getOwner(expected.caller)
        .getTrackID()
    ).to.equal(expected.trackid)

    expect(got)
      .to.have.property('trackid')
      .to.equal(expected.trackid)

    expect(got)
      .to.have.property('type')
      .to.equal(expected.type)

    matchLocation(got.loc, expected.loc)

    if (expected.merge) {
      expect(got.merge).to.equal(expected.merge)
    }
  }

  function matchLocation(got: SourceLocation, expected: SourceLocation) {
    expect(got.scriptUrl).to.equal(expected.scriptUrl)
    expect(got.lineNumber).to.equal(expected.lineNumber)
    // expect(got.columnNumber).to.equal(expected.columnNumber)
  }

  function getPrevLineSourceLocation(): SourceLocation {
    const loc = StackTrace.getSync()[1]

    return {
      scriptUrl: loc.fileName,
      lineNumber: loc.lineNumber - 1,
      columnNumber: loc.columnNumber
    }
  }

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

      expect(msgs).to.have.length(0)
    })

    it('should track other element appending a fragment', () => {
      const div = document.createElement('div')
      const child = document.createElement('div')
      const fragment = document.createDocumentFragment()

      fragment.appendChild(child)

      div.appendChild(fragment)
      const loc = getPrevLineSourceLocation()

      expect(msgs).to.have.length(1)

      matchActionInfo(msgs[0], {
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
      const loc = getPrevLineSourceLocation()

      expect(msgs).to.have.length(1)

      matchActionInfo(msgs[0], {
        caller: div,
        trackid: '1',
        type: ActionType.Attr,
        loc
      })
    })

    it('should track its method call', () => {
      const div = document.createElement('div')

      div.click()
      const loc = getPrevLineSourceLocation()

      expect(msgs).to.have.length(1)

      matchActionInfo(msgs[0], {
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
      const loc = getPrevLineSourceLocation()

      expect(msgs).to.have.length(1)

      matchActionInfo(msgs[0], {
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
      const loc = getPrevLineSourceLocation()

      expect(msgs).to.have.length(1)

      matchActionInfo(msgs[0], {
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
        const loc = getPrevLineSourceLocation()

        expect(msgs).to.have.length(1)

        matchActionInfo(msgs[0], {
          caller: div,
          trackid: '1',
          type: ActionType.Attr,
          loc
        })
      })

      it('should track removeAttribute', () => {
        const div = document.createElement('div')

        div.setAttribute('id', 'id') // msgs[0]
        div.removeAttribute('id') // msgs[1]
        const loc = getPrevLineSourceLocation()

        expect(msgs).to.have.length(2)

        matchActionInfo(msgs[1], {
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
        const loc = getPrevLineSourceLocation()

        expect(msgs).to.have.length(2)

        matchActionInfo(msgs[1], {
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
        const loc = getPrevLineSourceLocation()

        expect(msgs).to.have.length(1)

        matchActionInfo(msgs[0], {
          caller: div,
          trackid: '1',
          type: ActionType.Attr,
          loc
        })
      })

      it('should track setAttributeNode{NS} (merge scenario)', () => {
        const div = document.createElement('div')
        const idAttr = document.createAttribute('id')

        idAttr.value = 'id' // msgs[0] -> generate trackid 1

        div.setAttributeNode(idAttr) // msgs[1] -> generate trackid 2
        const loc = getPrevLineSourceLocation()

        expect(msgs).to.have.length(2)

        matchActionInfo(msgs[1], {
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
        expect(msgs).to.have.length(1)
      })
    })
  })

  describe('Node', () => {
    it('should track its property assignment', () => {
      const div = document.createElement('div')

      div.textContent = 'content'
      const loc = getPrevLineSourceLocation()

      expect(msgs).to.have.length(1)

      matchActionInfo(msgs[0], {
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
      const loc = getPrevLineSourceLocation()

      expect(msgs).to.have.length(1)

      matchActionInfo(msgs[0], {
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
      const loc = getPrevLineSourceLocation()

      expect(msgs).to.have.length(1)

      matchActionInfo(msgs[0], {
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
      const loc = getPrevLineSourceLocation()

      expect(msgs).to.have.length(1)

      matchActionInfo(msgs[0], {
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
      const loc = getPrevLineSourceLocation()

      expect(msgs).to.have.length(1)

      matchActionInfo(msgs[0], {
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
      const loc = getPrevLineSourceLocation()

      expect(msgs).to.have.length(1)

      matchActionInfo(msgs[0], {
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
      const loc = getPrevLineSourceLocation()

      expect(msgs).to.have.length(1)

      matchActionInfo(msgs[0], {
        caller: div.classList,
        trackid: '1',
        type: ActionType.Style,
        loc
      })
    })

    it('should track its methods', () => {
      const div = document.createElement('div')

      div.classList.add('class')
      const loc = getPrevLineSourceLocation()

      expect(msgs).to.have.length(1)

      matchActionInfo(msgs[0], {
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

      div.id = 'id' // msgs[0]

      div.attributes.removeNamedItem('id') // msgs[1]
      const loc = getPrevLineSourceLocation()

      expect(msgs).to.have.length(2)

      matchActionInfo(msgs[1], {
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

      id.value = 'id' // msgs[0] -> generate trackid 1

      div.attributes.setNamedItem(id) // msgs[1] -> generate trackid 2
      const loc = getPrevLineSourceLocation()

      expect(msgs).to.have.length(2)

      matchActionInfo(msgs[1], {
        caller: div.attributes,
        trackid: '2',
        type: ActionType.Attr,
        loc,
      })
    })
  })
})