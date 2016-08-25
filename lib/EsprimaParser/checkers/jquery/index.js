const Checker = require('../../structures/Checker')

const callback = (data) => {
  const jQuery = data.context.jQuery

  return !!jQuery && data.caller instanceof jQuery
}

module.exports = new Checker(callback, __dirname, {
  file: false
})
