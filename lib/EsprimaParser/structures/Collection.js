const EVENT = 'EVENT'
const MANIPULATION = 'MANIPULATION'

class Collection {
  constructor() {
    this.id = 0
    this.data = {}
  }

  get(id) {
    return this.data[id]
  }

  addInfoToElements({elements, type, info}) {
    for (const element of elements) {
      this.stubElementIfNeeded(element, type)
      this.addInfoToElement({element, type, info})
    }
  }

  stubElementIfNeeded(element, type) {
    if (type === Collection.EVENT && this.isNeededToStub(element)) {
      this.stubElement(element)
    }
  }

  isNeededToStub(element) {
    const id = element.dataset.collectionId

    return !!element.parentNode && (!id || this.isEventEmpty(id))
  }

  isEventEmpty(id) {
    const group = this.data[id][Collection.EVENT]

    for (const prop in group) {
      if (group.hasOwnProperty(prop)) {
        return false
      }
    }
    return true
  }

  stubElement(element) {
    const stubElement = element.cloneNode()
    const childNodes = element.childNodes

    while (childNodes.length) {
      stubElement.appendChild(childNodes[0])
    }
    element.parentNode.replaceChild(stubElement, element)
  }

  addInfoToElement({element, type, info}) {
    const key = this.getKey(info)
    const group = this.getGroup(element, type)

    this.addInfoToGroup(group, {
      key,
      code: info.code
    })
  }

  getKey({scriptUrl, loc}) {
    return `${scriptUrl}:${loc.start.line}:${loc.start.column}`
  }

  getGroup(element, type) {
    const id = this.getIdFromElement(element)

    return this.data[id][type]
  }

  getIdFromElement(element) {
    const dataset = element.dataset

    if (!dataset.hasOwnProperty('collectionId')) {
      dataset.collectionId = this.createCollection()
    }
    return dataset.collectionId
  }

  createCollection() {
    this.data[++this.id] = {
      [Collection.MANIPULATION]: {},
      [Collection.EVENT]: {}
    }
    return this.id
  }

  addInfoToGroup(group, {key, code}) {
    if (!group.hasOwnProperty(key)) {
      group[key] = code
    }
  }

  static get EVENT() {
    return EVENT
  }

  static get MANIPULATION() {
    return MANIPULATION
  }
}

module.exports = Collection
