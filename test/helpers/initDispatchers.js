/* dispatchers type declarations */
const DISPATCHERS = [
  /* Native */
  {
    type: 'HTMLElement',
    Call: true,
    Prop: true
  },
  {
    type: 'DOMTokenList',
    Call: true
  },
  {
    type: 'Attr',
    Prop: true
  },
  {
    type: 'CSSStyleDeclaration',
    Prop: true
  },
  /* jQuery */
  {
    type: 'jQuery',
    Call: true
  }
]

module.exports = (context) => {
  context.DISPATCHERS = DISPATCHERS
}
