// delete operator defined in EsprimaParser (it need to use parser's context)
module.exports = {
  '-': (argument) => -argument,
  '+': (argument) => +argument,
  '!': (argument) => !argument,
  '~': (argument) => ~argument,
  'typeof': (argument) => typeof argument,
  'void': () => undefined
};
