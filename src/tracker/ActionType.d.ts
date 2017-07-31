declare enum ActionType {
  None = 0,
  Attr = 1 << 0, // abbr for Attribute
  Behav = 1 << 1, // abbr for Behavior
  Event = 1 << 2,
  Node = 1 << 3,
  Style = 1 << 4
}