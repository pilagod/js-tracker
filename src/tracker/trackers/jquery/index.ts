import trackJqueryApis from './tracker'

export default function () {
  let __jquery__ = null;

  ['jQuery', '$'].map((propOfJquery) => {
    Reflect.defineProperty(window, propOfJquery, {
      set: function (jquery) {
        if (!__jquery__) {
          trackJqueryApis(jquery)
          __jquery__ = jquery
        }
      },
      get: function () {
        return __jquery__
      }
    })
  })
}