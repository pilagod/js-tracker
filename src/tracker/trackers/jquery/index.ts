import trackJqueryApis from './tracker'

export default function () {
  let __jquery__ = null;

  ['jQuery', '$'].map((propOfJquery) => {
    let value = undefined

    Reflect.defineProperty(window, propOfJquery, {
      set: function (jquery) {
        if (jquery !== __jquery__) {
          trackJqueryApis(jquery)
          __jquery__ = jquery
        }
        value = jquery
      },
      get: function () {
        return value
      }
    })
  })
}