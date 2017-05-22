import * as chai from 'chai'

const expect = chai.expect

describe('compatibility of default behaviors', function () {
  it('should compatible with HTMLElement default behaviors', (done) => {
    const div = document.createElement('div')

    /* property test */
    div.accessKey = 'accessKey'
    expect(div.accessKey).to.equal('accessKey')

    /* method test */
    div.onclick = function () {
      done()
    }
    div.click()
  })

  it('should compatible with Element default behaviors', () => {
    const div = document.createElement('div')

    /* property test */
    div.id = 'id'
    expect(div.id).to.equal('id')

    /* method test - simple */
    const div2 = document.createElement('div')
    div.insertAdjacentElement('afterbegin', div2)
    expect(div.children.length).to.equal(1)
    expect(div.children[0]).to.equal(div2)

    /* method test - complex */
    div.setAttribute('id', 'id2')
    expect(div.id).to.equal('id2')
  })

  it('should compatible with Node default behaviors', () => {
    const div = document.createElement('div')

    /* property test */
    div.innerText = 'text'
    expect(div.innerText).to.equal('text')

    /* method test */
    const div2 = document.createElement('div')
    div.appendChild(div2)
    expect(div.children.length).to.equal(1)
    expect(div.children[0]).to.equal(div2)
  })

  it('should compatible with EventTarget default behaviors', (done) => {
    const div = document.createElement('div')

    /* method test */
    div.addEventListener('click', function () {
      done()
    })
    div.click()
  })

  it('should compatible with Attr default behaviors', () => {
    const div = document.createElement('div')

    div.id = 'id'
    div.getAttributeNode('id').value = 'id2'
    expect(div.id).to.equal('id2')
  })

  it('should compatible with CSSStyleDeclaration default behaviors', () => {
    const div = document.createElement('div')

    /* property test */
    div.style.color = 'red'
    expect(div.style.color).to.equal('red')

    /* method test */
    div.style.setProperty('background-color', 'red')
    expect(div.style.backgroundColor).to.equal('red')
  })

  it('should compatible with DOMStringMap default behaviors', () => {
    const div = document.createElement('div')

    div.dataset.data = 'data'
    expect(div.dataset.data).to.equal('data')
  })

  it('should compatible with DOMTokenList default behaviors', () => {
    const div = document.createElement('div');

    /* property test */
    (<any>div.classList).value = 'class1'
    expect(div.classList.toString()).to.equal('class1')

    /* method test */
    div.classList.add('class2')
    expect(div.classList.toString()).to.equal('class1 class2')
  })

  it('should compatible with NamedNodeMap default behaviors', () => {
    const div = document.createElement('div')
    const attrid = document.createAttribute('id')

    attrid.value = 'id'

    div.attributes.setNamedItem(attrid)
    expect(div.getAttribute('id')).to.equal('id')

    const divNS = document.createElement('div')
    const attridNS = document.createAttributeNS('ns', 'id')

    attridNS.value = 'idns'

    divNS.attributes.setNamedItemNS(attridNS)
    expect(divNS.getAttributeNS('ns', 'id')).to.equal('idns')
  })
})