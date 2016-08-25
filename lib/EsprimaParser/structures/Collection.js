const EVENT = 'EVENT'
const MANIPULATION = 'MANIPULATION'

class Collection {
  constructor() {
    this.id = 0
    this.data = {}
  }

  addEvent(elements, info) {
    this.addFromElements(elements, info, Collection.EVENT)
  }

  addManipulation(elements, info) {
    this.addFromElements(elements, info, Collection.MANIPULATION)
  }

  addFromElements(elements, info, type) {
    for (const element of elements) {
      this.add(element, info, type)
    }
  }

  add(element, info, type) {
    const id = this.getCollectionIdOnElement(element)
    const key = this.getKeyFromInfo(info)
    const code = info.code

    this.addCodeToCollectionData({id, type, key, code})
  }

  getCollectionIdOnElement(element) {
    // @TODO: repeat use in same page
    if (!element.hasOwnProperty('CollectionId')) {
      element.CollectionId = this.createElementCollection()
    }
    return element.CollectionId
  }

  createElementCollection() {
    this.data[++this.id] = {
      [Collection.MANIPULATION]: {},
      [Collection.EVENT]: {}
    }
    return this.id
  }

  getKeyFromInfo(info) {
    return `${info.scriptUrl}:${info.loc.start.line}:${info.loc.start.column}`
  }

  addCodeToCollectionData({id, type, key, code}) {
    const group = this.getCollectionGroup(id, type)

    if (!group.hasOwnProperty(key)) {
      group[key] = code
    }
  }

  getCollectionGroup(id, type) {
    return this.data[id][type]
  }

  static get EVENT() {
    return EVENT
  }

  static get MANIPULATION() {
    return MANIPULATION
  }
}

module.exports = Collection
