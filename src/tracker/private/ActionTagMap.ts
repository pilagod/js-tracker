import { SymbolWhich } from './Symbols'

const ActionTagMap = {
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

type ActionTag = string | null
type ActionTags = ActionTag[]

const IActionTagMap = {
  fetchActionTag({ caller, target, action, args = [] }: {
    caller: ActionTarget,
    target: Target,
    action: Action,
    args?: any[]
  }): ActionTag {
    if (this.has(target, action)) {
      const tags = <ActionTags>ActionTagMap[target][action]

      switch (tags[0]) {
        case '#arg':
          return tags.slice(1).reduce((pre: object, cur: any) => pre[cur.toString()], args)
        case '#name':
          return (<Attr>caller).name
        case '#which':
          return (<DOMTokenList>caller)[SymbolWhich]
      }
    }
    return null
  },

  has(target: Target, action: Action): boolean {
    return !!(ActionTagMap[target] && ActionTagMap[target][action])
  }
}
export default IActionTagMap