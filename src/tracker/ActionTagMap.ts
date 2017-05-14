const ActionTagMap: object = {
  'Element': {
    'removeAttribute': '#arg.0',
    'removeAttributeNode': '#arg.0.value',
    'removeAttributeNS': '#arg.1',
    'setAttribute': '#arg.0',
    'setAttributeNode': '#arg.0.value',
    'setAttributeNodeNS': '#arg.0.value',
    'setAttributeNS': '#arg.1',
  },
  'Attr': {
    'value': '#name'
  },
  'DOMTokenList': {
    'value': '#which',

    'add': '#which',
    'remove': '#which',
    'replace': '#which',
    'toggle': '#which'
  },
  'NamedNodeMap': {
    'removeNamedItem': '#arg.0',
    'removeNamedItemNS': '#arg.1',
    'setNamedItem': '#arg.0',
    'setNamedItemNS': '#arg.1',
  }
}
export default ActionTagMap