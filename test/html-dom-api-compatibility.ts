import * as chai from 'chai'

const expect = chai.expect

describe('tracker\'s compatibility with html dom api', () => {
  describe('HTMLElement', () => {
    it('should set its property properly', () => {
      const div = document.createElement('div')

      div.accessKey = 'accessKey'

      expect(div.accessKey).to.equal('accessKey')
    })

    it('should call its method properly', function (done) {
      const div = document.createElement('div')

      div.onclick = () => {
        done()
      }
      div.click()
    })
  })

  describe('Element', () => {
    it('should set its property properly', () => {
      const div = document.createElement('div')

      div.id = 'id'

      expect(div.id).to.equal('id')
    })

    it('should call its method properly', () => {
      const div = document.createElement('div')
      const div2 = document.createElement('div')

      div.insertAdjacentElement('afterbegin', div2)

      expect(div.children).to.have.length(1)
      expect(div.children[0]).to.equal(div2)
    })

    /* anomalies */

    it('should call setAttributeNode properly', () => {
      const div = document.createElement('div')
      const id = document.createAttribute('id')

      id.value = 'id'
      div.setAttributeNode(id)

      expect(div.id).to.equal('id')
    })

    it('should call setAttributeNodeNS properly', () => {
      const div = document.createElement('div')
      const nsid = document.createAttributeNS('ns', 'id')

      nsid.value = 'nsid'
      div.setAttributeNodeNS(nsid)

      expect(div.getAttributeNS('ns', 'id')).to.equal('nsid')
    })
  })

  describe('Node', () => {
    it('should set its property properly', () => {
      const div = document.createElement('div')

      div.textContent = 'content'

      expect(div.textContent).to.equal('content')
    })

    it('should call its method properly', () => {
      const div = document.createElement('div')
      const div2 = document.createElement('div')

      div.appendChild(div2)

      expect(div.children).to.have.length(1)
      expect(div.children[0]).to.equal(div2)
    })
  })

  describe('EventTarget', () => {
    it('should call its method properly', function (done) {
      const div = document.createElement('div')

      div.addEventListener('click', () => {
        done()
      })
      div.click()
    })
  })

  describe('Attr', () => {
    /* anomalies */

    it('should set its property properly', () => {
      const id = document.createAttribute('id')

      id.value = 'id'

      expect(id.value).to.equal('id')
    })
  })

  describe('CSSStyleDeclaration', () => {
    it('should set its property properly', () => {
      const div = document.createElement('div')

      div.style.color = 'red'

      expect(div.style).to.be.instanceof(CSSStyleDeclaration)
      expect(div.style.color).to.equal('red')
    })

    it('should call its method properly', () => {
      const div = document.createElement('div')

      div.style.setProperty('color', 'red')

      expect(div.style.color).to.equal('red')
    })

    it('should handle each style independently', () => {
      const div = document.createElement('div')
      const div2 = document.createElement('div2')

      div.style.color = 'red'
      div2.style.color = 'blue'

      expect(div.style.color).to.equal('red')
      expect(div2.style.color).to.equal('blue')
      expect(div.style).to.not.equal(div2.style)
    })
  })

  describe('DOMStringMap', () => {
    it('should set its property properly', () => {
      const div = document.createElement('div')

      div.dataset.data = 'data'

      expect(div.dataset).to.be.instanceof(DOMStringMap)
      expect(div.dataset.data).to.equal('data')
    })

    it('should handle each dataset independently', () => {
      const div = document.createElement('div')
      const div2 = document.createElement('div2')

      div.dataset.data = 'data1'
      div2.dataset.data = 'data2'

      expect(div.dataset.data).to.equal('data1')
      expect(div2.dataset.data).to.equal('data2')
      expect(div.dataset).to.not.equal(div2.dataset)
    })
  })

  describe('DOMTokenList', () => {
    it('should set its property properly', () => {
      const div = document.createElement('div');

      // @NOTE: chrome has 'value' property
      (<any>div.classList).value = 'class'

      expect(div.classList.contains('class')).to.be.true
    })

    it('should call its method properly', () => {
      const div = document.createElement('div');

      div.classList.add('class')

      expect(div.classList.contains('class')).to.be.true
    })
  })

  describe('NamedNodeMap', () => {
    it('should call its method properly', () => {
      const div = document.createElement('div')

      div.id = 'id'
      div.attributes.removeNamedItem('id')

      expect(div.attributes.getNamedItem('id')).to.be.null
    })

    /* anomalies */

    it('should call setNamedItem properly', () => {
      const div = document.createElement('div')
      const id = document.createAttribute('id')

      id.value = 'id'
      div.attributes.setNamedItem(id)

      expect(div.id).to.equal('id')
    })

    it('should call setNamedItemNS properly', () => {
      const div = document.createElement('div')
      const nsid = document.createAttributeNS('ns', 'id')

      nsid.value = 'nsid'
      div.attributes.setNamedItemNS(nsid)

      expect(div.getAttributeNS('ns', 'id')).to.equal('nsid')
    })
  })
})