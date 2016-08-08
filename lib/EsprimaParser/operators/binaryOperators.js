module.exports = {
  '': (left, right) => right, // for AssignmentExpression '=' use
  '==': (left, right) => left == right,
  '!=': (left, right) => left != right,
  '===': (left, right) => left === right,
  '!==': (left, right) => left !== right,
  '<': (left, right) => left < right,
  '<=': (left, right) => left <= right,
  '>': (left, right) => left > right,
  '>=': (left, right) => left >= right,
  '<<': (left, right) => left << right,
  '>>': (left, right) => left >> right,
  '>>>': (left, right) => left >>> right,
  '+': (left, right) => left + right,
  '-': (left, right) => left - right,
  '*': (left, right) => left * right,
  '/': (left, right) => left / right,
  '%': (left, right) => left % right,
  '|': (left, right) => left | right,
  '^': (left, right) => left ^ right,
  '&': (left, right) => left & right,
  'in': (left, right) => left in right,
  // @TODO: if left is ClassAgent, comparing constructor with right instead
  // @TODO: should compare __proto__ until matched
  // @TODO: move to EsprimaParser
  'instanceof': (left, right) => left instanceof right
}
