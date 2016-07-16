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
  'instanceof': (left, right) => left instanceof right
}
