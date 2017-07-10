import * as chai from 'chai'
import * as StackTrace from 'stacktrace-js'

const expect = chai.expect

describe('DOM API tracker', () => {
  let msgs: ActionInfo[]

  before(() => {
    window.postMessage = function (msg) {
      msgs.push(msg)
    }
  })

  beforeEach(() => {
    msgs = []
  })

  type ExpectInfo = {
    caller: IActionTarget,
    trackid: string,
    target: string,
    action: Action,
    stackframe: StackTrace.StackFrame,
    actionTag?: string,
    merge?: string,
  }

  // @NOTE: getStackFrameWithLineOffset should call immediately 
  // after tracked actions on default
  function getStackFrameWithLineOffset(lineOffset: number = -1) {
    const stackframe = StackTrace.getSync()[1]

    return Object.assign({}, stackframe, {
      lineNumber: stackframe.lineNumber + lineOffset
    })
  }

  function matchActionInfo(got: ActionInfo, expected: ExpectInfo) {
    expect(expected.caller._owner)
      .to.have.property('_trackid')
      .to.equal(expected.trackid)

    expect(got)
      .to.have.property('trackid')
      .to.equal(expected.trackid)

    expect(got)
      .to.have.property('target')
      .to.equal(expected.target)

    expect(got)
      .to.have.property('action')
      .to.equal(expected.action)

    if (expected.stackframe) {
      matchStackFrame(got.stacktrace[2], expected.stackframe)
    }

    if (expected.merge) {
      expect(got.merge).to.equal(expected.merge)
    }

    if (expected.actionTag) {
      expect(got.actionTag).to.equal(expected.actionTag)
    }
  }

  function matchStackFrame(
    got: StackTrace.StackFrame,
    expected: StackTrace.StackFrame
  ) {
    expect(got.fileName).to.equal(expected.fileName)
    expect(got.lineNumber).to.equal(expected.lineNumber)
  }

  describe('HTMLElement', () => {
    it('should track its property assignment', () => {
      const div = document.createElement('div')

      div.accessKey = 'accessKey'
      const stackframe = getStackFrameWithLineOffset()

      expect(msgs).to.have.length(1)

      matchActionInfo(msgs[0], {
        caller: div,
        trackid: '1',
        target: 'HTMLElement',
        action: 'accessKey',
        stackframe
      })
    })

    it('should track its method call', () => {
      const div = document.createElement('div')

      div.click()
      const stackframe = getStackFrameWithLineOffset()

      expect(msgs).to.have.length(1)

      matchActionInfo(msgs[0], {
        caller: div,
        trackid: '1',
        target: 'HTMLElement',
        action: 'click',
        stackframe
      })
    })
  })

  describe('Element', () => {
    it('should track its property assignment', () => {
      const div = document.createElement('div')

      div.id = 'id'
      const stackframe = getStackFrameWithLineOffset()

      expect(msgs).to.have.length(1)

      matchActionInfo(msgs[0], {
        caller: div,
        trackid: '1',
        target: 'Element',
        action: 'id',
        stackframe
      })
    })

    it('should track its method call', () => {
      const div = document.createElement('div')
      const div2 = document.createElement('div')

      div.insertAdjacentElement('afterbegin', div2)
      const stackframe = getStackFrameWithLineOffset()

      expect(msgs).to.have.length(1)

      matchActionInfo(msgs[0], {
        caller: div,
        trackid: '1',
        target: 'Element',
        action: 'insertAdjacentElement',
        stackframe
      })
    })

    /* action tag */

    describe('set/removeAttribute', () => {
      it('should track setAttribute with action tag', () => {
        const div = document.createElement('div')

        div.setAttribute('id', 'id')
        const stackframe = getStackFrameWithLineOffset()

        expect(msgs).to.have.length(1)

        matchActionInfo(msgs[0], {
          caller: div,
          trackid: '1',
          target: 'Element',
          action: 'setAttribute',
          actionTag: 'id',
          stackframe
        })
      })

      it('should track removeAttribute with action tag', () => {
        const div = document.createElement('div')

        div.setAttribute('id', 'id') // msgs[0]

        div.removeAttribute('id') // msgs[1]
        const stackframe = getStackFrameWithLineOffset()

        expect(msgs).to.have.length(2)

        matchActionInfo(msgs[1], {
          caller: div,
          trackid: '1',
          target: 'Element',
          action: 'removeAttribute',
          actionTag: 'id',
          stackframe
        })
      })

      it('should track removeAttributeNode with action tag', () => {
        const div = document.createElement('div')

        div.setAttribute('id', 'id')

        const id = div.getAttributeNode('id')
        div.removeAttributeNode(id)
        const stackframe = getStackFrameWithLineOffset()

        expect(msgs).to.have.length(2)

        matchActionInfo(msgs[1], {
          caller: div,
          trackid: '1',
          target: 'Element',
          action: 'removeAttributeNode',
          actionTag: 'id',
          stackframe
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
        const stackframe = getStackFrameWithLineOffset()

        expect(msgs).to.have.length(1)

        matchActionInfo(msgs[0], {
          caller: div,
          trackid: '1',
          target: 'Element',
          action: 'setAttributeNode',
          actionTag: 'id',
          stackframe
        })
      })

      it('should track setAttributeNode{NS} (merge scenario)', () => {
        const div = document.createElement('div')
        const idAttr = document.createAttribute('id')

        idAttr.value = 'id' // msgs[0] -> generate trackid 1

        div.setAttributeNode(idAttr) // msgs[1] -> generate trackid 2
        const stackframe = getStackFrameWithLineOffset()

        expect(msgs).to.have.length(2)

        matchActionInfo(msgs[1], {
          caller: div,
          trackid: '2',
          target: 'Element',
          action: 'setAttributeNode',
          actionTag: 'id',
          merge: '1',
          stackframe
        })
      })

      it('should track setAttributeNode{NS} (error scenario)', () => {
        const div = document.createElement('div')
        const div2 = document.createElement('div')

        div.id = 'id'

        const error = function () {
          div2.setAttributeNode(div.attributes[0])
        }
        expect(error).to.throw()
      })
    })
  })

  describe('Node', () => {
    it('should track its property assignment', () => {
      const div = document.createElement('div')

      div.textContent = 'content'
      const stackframe = getStackFrameWithLineOffset()

      expect(msgs).to.have.length(1)

      matchActionInfo(msgs[0], {
        caller: div,
        trackid: '1',
        target: 'Node',
        action: 'textContent',
        stackframe
      })
    })

    it('should track its method call', () => {
      const div = document.createElement('div')
      const div2 = document.createElement('div')

      div.appendChild(div2)
      const stackframe = getStackFrameWithLineOffset()

      expect(msgs).to.have.length(1)

      matchActionInfo(msgs[0], {
        caller: div,
        trackid: '1',
        target: 'Node',
        action: 'appendChild',
        stackframe
      })
    })
  })

  describe('EventTarget', () => {
    it('should track its method call', () => {
      const div = document.createElement('div')

      div.addEventListener('click', () => { })
      const stackframe = getStackFrameWithLineOffset()

      expect(msgs).to.have.length(1)

      matchActionInfo(msgs[0], {
        caller: div,
        trackid: '1',
        target: 'EventTarget',
        action: 'addEventListener',
        stackframe
      })
    })
  })

  describe('Attr', () => {
    it('should track its property assignment', () => {
      const idAttr = document.createAttribute('id')

      idAttr.value = 'id'
      const stackframe = getStackFrameWithLineOffset()

      expect(msgs).to.have.length(1)

      matchActionInfo(msgs[0], {
        caller: idAttr,
        trackid: '1',
        target: 'Attr',
        action: 'value',
        actionTag: 'id',
        stackframe
      })
    })
  })

  describe('CSSStyleDeclaration', () => {
    it('should track its property assignment', () => {
      const div = document.createElement('div')

      div.style.color = 'red'
      const stackframe = getStackFrameWithLineOffset()

      expect(div.style._owner).to.equal(div)
      expect(msgs).to.have.length(1)

      matchActionInfo(msgs[0], {
        caller: div.style,
        trackid: '1',
        target: 'CSSStyleDeclaration',
        action: 'color',
        stackframe
      })
    })
  })

  describe('DOMStringMap', () => {
    it('should track its property assignment', () => {
      const div = document.createElement('div')

      div.dataset.data = 'data'
      const stackframe = getStackFrameWithLineOffset()

      expect(div.dataset._owner).to.equal(div)
      expect(msgs).to.have.length(1)

      matchActionInfo(msgs[0], {
        caller: div.dataset,
        trackid: '1',
        target: 'DOMStringMap',
        action: 'data',
        stackframe
      })
    })
  })

  describe('DOMTokenList', () => {
    it('should track its value property assignment', () => {
      const div = document.createElement('div')

      div.classList.value = 'class'
      const stackframe = getStackFrameWithLineOffset()

      expect(msgs).to.have.length(1)

      matchActionInfo(msgs[0], {
        caller: div.classList,
        trackid: '1',
        target: 'DOMTokenList',
        action: 'value',
        actionTag: 'classList',
        stackframe
      })
    })

    it('should track its methods', () => {
      const div = document.createElement('div')

      div.classList.add('class')
      const stackframe = getStackFrameWithLineOffset()

      expect(msgs).to.have.length(1)

      matchActionInfo(msgs[0], {
        caller: div.classList,
        trackid: '1',
        target: 'DOMTokenList',
        action: 'add',
        actionTag: 'classList',
        stackframe
      })
    })
  })

  describe('NamedNodeMap', () => {
    it('should track removeNamedItem with action tag', () => {
      const div = document.createElement('div')

      div.id = 'id' // msgs[0]

      div.attributes.removeNamedItem('id') // msgs[1]
      const stackframe = getStackFrameWithLineOffset()

      expect(msgs).to.have.length(2)

      matchActionInfo(msgs[1], {
        caller: div.attributes,
        trackid: '1',
        target: 'NamedNodeMap',
        action: 'removeNamedItem',
        actionTag: 'id',
        stackframe
      })
    })

    /* anomalies */

    it('should track setNamedItem', () => {
      const div = document.createElement('div')
      const id = document.createAttribute('id')

      id.value = 'id' // msgs[0] -> generate trackid 1

      div.attributes.setNamedItem(id) // msgs[1] -> generate trackid 2
      const stackframe = getStackFrameWithLineOffset()

      expect(msgs).to.have.length(2)

      matchActionInfo(msgs[1], {
        caller: div.attributes,
        trackid: '2',
        target: 'NamedNodeMap',
        action: 'setNamedItem',
        actionTag: 'id',
        stackframe
      })
    })
  })
})