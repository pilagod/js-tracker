import * as chai from 'chai'

const expect = chai.expect

describe('tracker\'s compatibility of native behaviors', function () {
  describe('HTMLElement', function () {
    it('should set property properly', function () {
      const div = document.createElement('div')

      div.accessKey = 'accessKey'

      expect(div.accessKey).to.equal('accessKey')
    })

    it('should call method properly', function (done) {
      const div = document.createElement('div')

      div.onclick = function () {
        done()
      }
      div.click()
    })

    /* anomalies */

    it('should keep dataset\'s default behaviors', function () {
      const div = document.createElement('div')

      div.dataset.data = 'data'

      expect(div.dataset).to.be.instanceof(DOMStringMap)
      expect(div.dataset.data).to.equal('data')
    })

    it('should keep style\'s default behaviors', function () {
      const div = document.createElement('div')

      div.style.color = 'red'

      expect(div.style).to.be.instanceof(CSSStyleDeclaration)
      expect(div.style.color).to.equal('red')
    })
  })

  describe('Element', function () {
    it('should set property properly', function () {
      const div = document.createElement('div')

      div.id = 'id'

      expect(div.id).to.equal('id')
    })

    it('should call method properly', function () {
      const div = document.createElement('div')
      const div2 = document.createElement('div')

      div.insertAdjacentElement('afterbegin', div2)

      expect(div.children).to.have.length(1)
      expect(div.children[0]).to.equal(div2)
    })

    /* anomalies */

    it('should call setAttributeNode properly', function () {
      const div = document.createElement('div')
      const id = document.createAttribute('id')

      id.value = 'id'
      div.setAttributeNode(id)

      expect(div.id).to.equal('id')
    })

    it('should call setAttributeNodeNS properly', function () {
      const div = document.createElement('div')
      const nsid = document.createAttributeNS('ns', 'id')

      nsid.value = 'nsid'
      div.setAttributeNodeNS(nsid)

      expect(div.getAttributeNS('ns', 'id')).to.equal('nsid')
    })
  })

  describe('Node', function () {
    it('should set property properly', function () {
      const div = document.createElement('div')

      div.innerText = 'text'

      expect(div.innerText).to.equal('text')
    })

    it('should call method properly', function () {
      const div = document.createElement('div')
      const div2 = document.createElement('div')

      div.appendChild(div2)

      expect(div.children).to.have.length(1)
      expect(div.children[0]).to.equal(div2)
    })
  })

  describe('EventTarget', function () {
    it('should call method properly', function (done) {
      const div = document.createElement('div')

      div.addEventListener('click', function () {
        done()
      })
      div.click()
    })
  })

  describe('Attr', function () {
    /* anomalies */

    it('should keep value\'s default behaviors', function () {
      const id = document.createAttribute('id')

      id.value = 'id'

      expect(id.value).to.equal('id')
    })
  })

  describe('CSSStyleDeclaration', function () {
    it('should call method properly', function () {
      const div = document.createElement('div')

      div.style.setProperty('color', 'red')

      expect(div.style.color).to.equal('red')
    })
  })

  it('should compatible with DOMStringMap default behaviors', () => {
    const div = document.createElement('div')

    div.dataset.data = 'data'
    expect(div.dataset.data).to.equal('data')
  })

  describe('DOMTokenList', function () {
    it('should set property properly', function () {
      const div = document.createElement('div');

      // @NOTE: chrome has 'value' property
      (<any>div.classList).value = 'class'

      expect(div.classList.contains('class')).to.be.true
    })

    it('should call method properly', function () {
      const div = document.createElement('div');

      div.classList.add('class')

      expect(div.classList.contains('class')).to.be.true
    })
  })

  describe('NamedNodeMap', function () {
    it('should call method properly', function () {
      const div = document.createElement('div')

      div.id = 'id'
      div.attributes.removeNamedItem('id')

      expect(div.attributes).to.have.length(0)
    })

    /* anomalies */

    it('should call setNamedItem properly', function () {
      const div = document.createElement('div')
      const id = document.createAttribute('id')

      id.value = 'id'
      div.attributes.setNamedItem(id)

      expect(div.id).to.equal('id')
    })

    it('should call setNamedItemNS properly', function () {
      const div = document.createElement('div')
      const nsid = document.createAttributeNS('ns', 'id')

      nsid.value = 'nsid'
      div.attributes.setNamedItemNS(nsid)

      expect(div.getAttributeNS('ns', 'id')).to.equal('nsid')
    })
  })
})