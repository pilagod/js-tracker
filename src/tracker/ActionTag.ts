const ActionTag: object = {
  'Element': {
    'removeAttribute': ['#arg', '0'],
    'removeAttributeNode': ['#arg', '0', 'name'],
    'removeAttributeNS': ['#arg', '1'],
    'setAttribute': ['#arg', '0'],
    'setAttributeNode': ['#arg', '0', 'name'],
    'setAttributeNodeNS': ['#arg', '0', 'name'],
    'setAttributeNS': ['#arg', '1'],
  },
  'Attr': {
    'value': ['#name']
  },
  'DOMTokenList': {
    'value': ['#which'],

    'add': ['#which'],
    'remove': ['#which'],
    'replace': ['#which'],
    'toggle': ['#which']
  },
  'NamedNodeMap': {
    'removeNamedItem': ['#arg', '0'],
    'removeNamedItemNS': ['#arg', '1'],
    'setNamedItem': ['#arg', '0', 'name'],
    'setNamedItemNS': ['#arg', '0', 'name'],
  }
}
export default ActionTag