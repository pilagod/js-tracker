/// <reference path='./ActionTag.d.ts'/>

const ActionTag: object = {
  'Element': {
    // general
    'removeAttribute': ['#arg', '0'],
    'removeAttributeNode': ['#arg', '0', 'name'],
    'removeAttributeNS': ['#arg', '1'],
    'setAttribute': ['#arg', '0'],
    'setAttributeNS': ['#arg', '1'],
    // anomalies
    'setAttributeNode': ['#arg', '0', 'name'],
    'setAttributeNodeNS': ['#arg', '0', 'name'],
  },
  'Attr': {
    // anomalies
    'value': ['#name']
  },
  'DOMTokenList': {
    // general
    'value': ['#which'],
    'add': ['#which'],
    'remove': ['#which'],
    'replace': ['#which'],
    'toggle': ['#which']
  },
  'NamedNodeMap': {
    // general
    'removeNamedItem': ['#arg', '0'],
    'removeNamedItemNS': ['#arg', '1'],
    // anomalies
    'setNamedItem': ['#arg', '0', 'name'],
    'setNamedItemNS': ['#arg', '0', 'name'],
  }
}
const _: IActionTag = {
  has(target, action) {
    return ActionTag.hasOwnProperty(target)
      && ActionTag[target].hasOwnProperty(action)
  },
  parse(caller, target, action, args = []) {
    if (this.has(target, action)) {
      const tags = ActionTag[target][action]

      switch (tags[0]) {
        case '#arg':
          return tags.slice(1).reduce((pre, cur) => pre[cur], args)
        case '#name':
          return (<Attr>caller).name
        case '#which':
          return (<DOMTokenList>caller)._which
      }
    }
  }
}
export default _