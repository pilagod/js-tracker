import trackJqueryApis from './tracker'

export default function () {
  ['jQuery', '$'].map((propOfJquery) => {
    let value = undefined
    // noConflict issue: [http://api.jquery.com/jQuery.noconflict/]
    Reflect.defineProperty(window, propOfJquery, {
      set: function (obj) {
        if (isJquery(obj) && !isTracked(obj)) {
          trackJqueryApis(obj)
          markTracked(obj)
        }
        value = obj
      },
      get: function () {
        return value
      }
    })
  })
}

const SymbolTracked = Symbol('tracked')

function isJquery(obj) {
  return typeof obj === 'function' && typeof obj.prototype.jquery === 'string'
}

function isTracked(obj) {
  return !!obj[SymbolTracked]
}

function markTracked(obj) {
  obj[SymbolTracked] = true
}