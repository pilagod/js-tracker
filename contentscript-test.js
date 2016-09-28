console.log('content script start');

require('es6-promise').polyfill()
require('isomorphic-fetch')

document.write('<div>Initializing JS-Tracking</div>');

fetch(window.location.href)
  .then((response) => response.text())
  .then((htmlString) => {
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
  })
// var scripts = document.getElementsByTagName('script')
// console.log(scripts);
// for (var i = 0; i < scripts.length; i += 1) {
//   console.log(script);
// }
