/* dispatchers type declarations */
const DISPATCHERS = [
  {
    type: 'HTMLElement',
    call: {event: true, mani: true},
    prop: {event: true, mani: true}
  },
  {
    type: 'DOMTokenList',
    call: {mani: true}
  },
  {
    type: 'Attr',
    prop: {mani: true}
  }
]

module.exports = (context) => {
  context.DISPATCHERS = DISPATCHERS
}
