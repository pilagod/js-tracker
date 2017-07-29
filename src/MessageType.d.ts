// One important difference between ambient and non-ambient 
// enums is that, in regular enums, members that don’t have
// an initializer are considered constant members. For non-const
// ambient enums member that does not have initializer is considered
// computed.
declare enum MessageType {
  ActionStoreUpdated = 0,
  DevtoolSelectionChanged = 1
}