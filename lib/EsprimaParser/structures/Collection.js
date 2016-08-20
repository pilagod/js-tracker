const CallChecker = require('./CallChecker')

class Collection {
  constructor() {
    this.id = 0
    this.data = {}
  }

  addEvent(elements, info) {
    this.addFromElements(elements, info, CallChecker.EVENT)
  }

  addManipulation(elements, info) {
    this.addFromElements(elements, info, CallChecker.MANIPULATION)
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

  getKeyFromInfo(info) {
    return `${info.scriptUrl}:${info.loc.start.line}:${info.loc.start.column}`
  }

  getCollectionIdOnElement(element) {
    // @TODO: repeat use in same page
    // @TODO: refine
    if (!element.hasOwnProperty('CollectionId')) {
      element.CollectionId = ++this.id

      this.data[this.id] = {
        [CallChecker.MANIPULATION]: {},
        [CallChecker.EVENT]: {}
      }
    }
    return element.CollectionId
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
}

module.exports = Collection
