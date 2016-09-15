const EVENT = 'EVENT'
const MANIPULATION = 'MANIP'

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
      // $(document) -> document (has no dataset) -> broken
      if (element.dataset) {
        this.addInfoToElement({element, type, info})
      }
    }
  }

  addInfoToElement({element, type, info}) {
    const key = this.getKey(info.loc)
    const group = this.getGroup({
      element,
      type,
      scriptUrl: info.scriptUrl
    })
    this.addInfoToGroup(group, {
      key,
      code: info.code
    })
  }

  getKey(loc) {
    return `[${loc.start.line}:${loc.start.column}]-[${loc.end.line}:${loc.end.column}]`
  }

  getGroup({element, type, scriptUrl}) {
    const id = this.getIdFromElement(element)
    const group = this.data[id][type]

    if (!group[scriptUrl]) {
      group[scriptUrl] = {}
    }
    return group[scriptUrl]
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
      group[key] = this.normalizeCode(code)
    }
  }

  normalizeCode(code) {
    return code.substr(0, 75) + (code.length > 75 ? '...' : '')
  }

  static get EVENT() {
    return EVENT
  }

  static get MANIPULATION() {
    return MANIPULATION
  }
}

module.exports = Collection
