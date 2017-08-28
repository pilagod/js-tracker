enum ActionType {
  None = 0,
  Attr = 1 << 0, // abbr for Attribute
  Behav = 1 << 1, // abbr for Behavior
  Event = 1 << 2,
  Node = 1 << 3,
  Style = 1 << 4
}
export default ActionType
export const ActionTypeNames = Object.keys(ActionType).filter((type) => {
  // @NOTE: typescript enum has both name and value key,
  // name key passing through parseInt will return NaN
  return isNaN(parseInt(type)) && type !== 'None'
})