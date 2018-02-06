import trackJqueryApis from './tracker'

export default function () {
  let shouldTrack = true;

  ['jQuery', '$'].map((propOfJquery) => {
    let value = undefined

    Reflect.defineProperty(window, propOfJquery, {
      set: function (jquery) {
        if (shouldTrack) {
          trackJqueryApis(jquery)
          shouldTrack = false
        }
        value = jquery
      },
      get: function () {
        return value
      }
    })
  })
}