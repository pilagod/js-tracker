declare enum ActionTypes {
  None = 0,
  Attribute = 1 << 0,
  Behavior = 1 << 1,
  Event = 1 << 2,
  Node = 1 << 3,
  Style = 1 << 4
}