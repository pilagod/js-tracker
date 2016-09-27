// @TODO: window event execute twice
console.log('<==== init tracking ====>')

require('es6-promise').polyfill()
require('isomorphic-fetch')

if (!window.esprimaParser) {
  window.esprimaParser = new (require('./lib/EsprimaParser'))(window)
}
const esprima = require('esprima')
const mimetypes = require('./mimetypes')

const url = window.location.href

main()

function main() {
  // re-init page and start tracking scripts
  fetch(window.location.href)
    .then((response) => response.text())
    .then((htmlString) => {
      stubPageFrom(htmlString)
      clearAllTimeouts()
      trackingScripts()
    })
}

function stubPageFrom(htmlString) {
  // init all elements and remove all event listeners
  const parser = new DOMParser()
  const stubDocument = parser.parseFromString(htmlString, 'text/html')

  let stubHtml

  for (const child of stubDocument.children) {
    if (child.tagName === 'HTML') {
      stubHtml = child
      break
    }
  }
  const html = document.getElementsByTagName('html')[0]

  html.parentNode.replaceChild(stubHtml, html)
}

function clearAllTimeouts() {
  let id = setTimeout(function () {}, 9999)

  do {
    clearTimeout(id)
  } while (id --)
}

function trackingScripts() {
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
        return true
      })
    }
  })

  p.then(() => {
    console.log(asts)

    asts.forEach((ast) => {
      console.log(ast.url);
      esprimaParser.parseAst(ast.root, ast.url)
    })
  }).then(() => {
    triggerWindowLoad()
    addDevtoolsSelectionChangedListener()
  }).then(() => {
    console.log('<==== start tracking ====>')
  })

  function triggerWindowLoad() {
    const jQuery = window.jQuery || window.$
    // window.dispatchEvent(new Event('load'))
    // will trigger original window onload
    if (jQuery) {
      // document ready events would occur after all promise finished,
      // wrap window load trigger with document ready to ensure load called after ready
      $(document).ready(() => {
        // $(window).trigger('load')
        window.dispatchEvent(new Event('load'))
      })
    } else {
      window.dispatchEvent(new Event('load'))
    }
  }

  function addDevtoolsSelectionChangedListener() {
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
  }
}
