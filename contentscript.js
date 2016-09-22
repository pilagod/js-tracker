console.log('<==== init tracking ====>')

// stub whole html (remove all event listener)
const html = document.getElementsByTagName('html')[0]
const stubHtml = html.cloneNode(true)

html.parentNode.replaceChild(stubHtml, html)
//

// clear all timeouts
let id = setTimeout(function () {}, 9999)

do {
  clearTimeout(id)
} while (id --)
//

require('es6-promise').polyfill()
require('isomorphic-fetch')

if (!window.esprimaParser) {
  window.esprimaParser = new (require('./lib/EsprimaParser'))(window)
}

const esprima = require('esprima')
const mimetypes = require('./mimetypes')

const url = window.location.href
const asts = []
const scripts = Array.prototype.slice.call(document.getElementsByTagName('script'))

let p = Promise.resolve(true);

scripts.forEach((script) => {
  if (!script.type || mimetypes.hasOwnProperty(script.type)) {
    // parse only valid type of scripts
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
  }
})

p.then(() => {
  console.log(asts)

  asts.forEach((ast) => {
    esprimaParser.parseAst(ast.root, ast.url)
  })
  // trigger content script window onload event
  // window.dispatchEvent(new Event('load')) will trigger original window onload
  window.onload()
  console.log('<==== start tracking ====>')
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
