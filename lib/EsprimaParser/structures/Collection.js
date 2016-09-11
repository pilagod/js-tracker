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
      this.add({element, type, info})
    }
  }

  add({element, type, info}) {
    const id = this.getCollectionIdFrom(element)
    const group = this.getCollectionGroup(id, type)
    const key = this.getKeyFrom(info)

    this.addCodeToCollectionGroup(group, key, info.code)
  }

  getCollectionIdFrom(element) {
    // @TODO: data set
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

  getCollectionGroup(id, type) {
    return this.data[id][type]
  }

  getKeyFrom(info) {
    return `${info.scriptUrl}:${info.loc.start.line}:${info.loc.start.column}`
  }

  addCodeToCollectionGroup(group, key, code) {
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
