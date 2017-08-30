/// <reference path='./Anomalies.d.ts'/>

const Anomalies = {
  'HTMLElement': {
    'dataset': true,
    'style': true
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
const _: IAnomalies = {
  has(target, action) {
    return !!(Anomalies[target] && Anomalies[target][action])
  }
}
export default _