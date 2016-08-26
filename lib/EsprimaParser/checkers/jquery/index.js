const Checker = require('../../structures/Checker')

const callback = ({context, caller}) => {
  const jQuery = context.jQuery

  return !!jQuery && caller instanceof jQuery
}

module.exports = new Checker(callback, __dirname, {
  file: false
})
