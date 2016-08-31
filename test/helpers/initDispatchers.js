/* dispatchers type declarations */
const DISPATCHERS = [
  {
    type: 'HTMLElement',
    Call: {event: true, mani: true},
    Prop: {event: true, mani: true}
  },
  {
    type: 'DOMTokenList',
    Call: {mani: true}
  },
  {
    type: 'Attr',
    Prop: {mani: true}
  }
]

module.exports = (context) => {
  context.DISPATCHERS = DISPATCHERS
}
