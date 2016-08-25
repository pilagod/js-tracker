const Checker = require('../../structures/Checker')

const callback = (data) => {
  const HTMLElement = data.context.HTMLElement

  return !!HTMLElement && data.caller instanceof HTMLElement
}

module.exports = new Checker(callback, __dirname, {
  file: false
})
