const dataset = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'dataset')
const style = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'style')

// Element.attributes
// Element.classList

Object.defineProperty(HTMLElement.prototype, 'dataset', {
  get: function () {
    if (!this._dataset) {
      // @NOTE: dataset can't set _parent property, which will be shown on element
      const parent = this
      this._dataset = new Proxy(dataset.get.call(this), {
        set: function (target, prop, value) {
          if (prop !== 'trackid') {
            console.log('dataset is being updated, parent', parent)
          }
          target[prop] = value
          return true
        }
      })
    }
    return this._dataset
  }
})
Object.defineProperty(HTMLElement.prototype, 'style', {
  get: function () {
    if (!this._style) {
      const origin = style.get.call(this)
      origin._parent = this
      this._style = new Proxy(origin, {
        set: function (target, prop, value) {
          // @TODO: check prop is not a function
          console.log('style is being updated, parent ', target._parent)
          target[prop] = value
          return true
        }
      })
    }
    return this._style
  },
  set: style.set
})
var div = document.getElementById('test')

div.dataset.key = 1
div.dataset.trackid = 1

div.style.color = 'red'
div.style.cssText = 'color: blue;'

console.dir(document.querySelector('[data-trackid="1"]'))

window.postMessage({trackid: div.dataset.trackid}, '*')
