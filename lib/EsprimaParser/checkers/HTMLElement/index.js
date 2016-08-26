const Checker = require('../../structures/Checker')

const callback = ({context, caller}) => {
  const HTMLElement = context.HTMLElement

  return !!HTMLElement && caller instanceof HTMLElement
}

module.exports = new Checker(callback, __dirname, {
  file: false
})
