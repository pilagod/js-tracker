// var scriptText

// function readTextFile (file) {
//   var rawFile = new XMLHttpRequest()
//   rawFile.open('GET', file, false)
//   rawFile.onreadystatechange = function () {
//     if (rawFile.readyState === 4) {
//       console.log(rawFile.status)
//       if (rawFile.status === 200 || rawFile.status === 0) {
//         scriptText = rawFile.responseText
//       }
//     }
//   }
//   rawFile.send(null)
// }
// readTextFile('src/background.js')

// self.onmessage = function () {
//   self.postMessage(scriptText)
// }

var script = document.createElement('script')
script.src = chrome.extension.getURL('src/tracker.js')
script.async = false
script.onload = function () {
  document.documentElement.removeChild(script)
}
document.documentElement.appendChild(script)
