const Anomalies = {
  'HTMLElement': {
    'dataset': true,
    'style': true,

    'blur': true,
    'click': true,
    'focus': true
  },
  'Element': {
    'attributes': true,
    'classList': true,

    'setAttributeNode': true,
    'setAttributeNodeNS': true
  },
  'Attr': {
    'value': true
  },
  'NamedNodeMap': {
    'setNamedItem': true,
    'setNamedItemNS': true
  }
}
const IAnomalies = {
  has(target: Target, action: Action): boolean {
    return !!(Anomalies[target] && Anomalies[target][action])
  }
}
export default IAnomalies