import './index.html'
import Types, { propCls, methodCls } from './tracker/class'

// @TODO: deal with outerHTML (converting HTML string to element), check [http://stackoverflow.com/questions/3103962/converting-html-string-into-dom-elements]
// @TODO: deal with innerHTML (converting HTML string to element), check [http://stackoverflow.com/questions/3103962/converting-html-string-into-dom-elements]
// @TODO: inplace replace descriptors

const trackedDescriptors: PropertyDescriptorMap = {}

for (let proto = HTMLElement.prototype; proto !== Object.prototype; proto = Object.getPrototypeOf(proto)) {
  Object.getOwnPropertyNames(proto).forEach((prop) => {
    if (propCls.hasOwnProperty(prop)) {
      trackedDescriptors[prop] = createTrackedPropDescriptor(proto, prop)
    }
    if (methodCls.hasOwnProperty(prop)) {
      trackedDescriptors[prop] = createTrackedMethodDescriptor(proto, prop)
    }
    // @TODO: get function value
  })
}
console.log(trackedDescriptors)

function createTrackedPropDescriptor(proto: object, prop: string): object {
  // @TODO: replace 'set' function
  return Object.getOwnPropertyDescriptor(proto, prop)
}

function createTrackedMethodDescriptor(proto: object, prop: string): object {
  // @TODO: replace 'value' function
  return Object.getOwnPropertyDescriptor(proto, prop)
}

document.createElement('div').align

// @TODO: cope with (attributes[NamedNodeMap, Attr], classList[DOMTokenList], dataset, style[CSSStyleDeclaration])
// @TODO: should modify their prototype

// document.registerElement('tracked-div', {
//   extends: 'div',
//   prototype: Object.create(HTMLDivElement.prototype, {
//     innerHTML: {
//       get: function () { return console.log('get innerHTML'), trackedDescriptors['innerHTML'].get.call(this) },
//       set: function (value) { return console.log('set innerHTML'), trackedDescriptors['innerHTML'].set.call(this, value) }
//     }
//   })
// })

// // @TODO: attr value assignment
// const div = document.createElement('div', 'tracked-div')
// div.innerText = 'test'
// document.body.appendChild(div)

// console.dir(div)
// div.style.color = 'red'
// div.style.cssText = 'color: blue;'
// console.log(div.attributes)
// console.log(Attr.prototype)

// div.innerHTML = '<p></p>'
// div.innerText = '<span></span>'
// div.textContent = '<span></span>'



// var styleDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'style')
// var styleGetter = styleDescriptor.get
// var styleSetter = styleDescriptor.set

// var styleProperty: PropertyDescriptorMap = {
//   style: {
//     get: function () { return console.log('getter'), styleGetter.call(this) },
//     set: function (value) { return styleSetter.call(this, value) }
//   }
// }
// document.registerElement('tracked-div', {
//   extends: 'div',
//   prototype: Object.create(HTMLDivElement.prototype)//, styleProperty)
// })
// var trackedDiv = document.createElement('div', 'tracked-div')
// console.dir(trackedDiv)
// console.log(trackedDiv.style)
// trackedDiv.style.color = 'red'
// document.body.appendChild(trackedDiv)

