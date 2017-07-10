// import TrackStore from './TrackStore'

// declare global {
  // interface Window {
    // _trackStore: TrackStore
  // }
// }

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

// var script = document.createElement('script')
// script.src = chrome.extension.getURL('src/tracker.js')
// script.async = false
// script.onload = function () {
//   document.documentElement.removeChild(script)
// }
// document.documentElement.appendChild(script)

window.addEventListener('message', function (event) {
  console.log(event)
  const target = document.querySelector(`[data-trackid="${event.data.trackid}"]`)
  target.style.color = 'red'
})
console.log('contentscript loaded')
var script = document.createElement('script')
script.src = chrome.extension.getURL('src/injectscript.js')
script.async = false
document.documentElement.appendChild(script)
