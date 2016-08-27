const Checker = require('../../structures/Checker')

const callback = ({context, caller}) => {
  const HTMLDocument = context.HTMLDocument

  return !!HTMLDocument && caller instanceof HTMLDocument
}

module.exports = new Checker(callback, __dirname, {
  file: false
})
