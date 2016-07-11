module.exports = {
  '-': (argument) => -argument,
  '+': (argument) => +argument,
  '!': (argument) => !argument,
  '~': (argument) => ~argument,
  'typeof': (argument) => typeof argument,
  'void': () => undefined,
  'delete': (object, property) => delete object[property]
};
