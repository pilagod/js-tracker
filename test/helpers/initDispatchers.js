/* dispatchers type declarations */
const DISPATCHERS = [
  /* Native */
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
  },

  /* jQuery */
  {
    type: 'jQuery',
    Call: {}
  }
]

module.exports = (context) => {
  context.DISPATCHERS = DISPATCHERS
}
