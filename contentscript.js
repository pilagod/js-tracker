console.log('excuting content script')

const body = document.getElementsByTagName('body')[0]
const stubBody = body.cloneNode(true)
body.parentNode.replaceChild(stubBody, body)

require('es6-promise').polyfill()
require('isomorphic-fetch')

if (!window.esprimaParser) {
  window.esprimaParser = new (require('./lib/EsprimaParser'))(window)
}

const esprima = require('esprima')

const url = window.location.href
const asts = []
const scripts = Array.prototype.slice.call(document.getElementsByTagName('script'))

let p = Promise.resolve(true);

scripts.forEach((script) => {
  p = p.then(() => {
    if (script.src) {
      return fetch(script.src)
        .then((response) => response.text())
        .then((scriptText) => {
          asts.push({
            url: script.src,
            root: esprima.parse(scriptText, {loc: true})
          })
        })
    } else if (script.innerHTML) {
      asts.push({
        url,
        root: esprima.parse(script.innerHTML, {loc: true})
      })
    }
    return Promise.resolve(true)
  })
})

console.log(asts);

p.then(() => {
  asts.forEach((ast) => {
    esprimaParser.parseAst(ast.root, ast.url)
  })
})

if (!window.onDevtoolsSelectionChanged) {
  window.onDevtoolsSelectionChanged = (element) => {
    console.log('onSelectionChanged', element);
    const id = element.dataset.collectionId
    const info = id ? esprimaParser.collection.get(id) : {}

    chrome.runtime.sendMessage(info, (response) => {
      console.log(response)
    });
  }
}
