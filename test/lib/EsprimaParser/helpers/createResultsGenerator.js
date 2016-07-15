module.exports = (results) => {
  const returns = (function* () {
    for (const result of results) {
      yield result
    }
  })()
  return () => returns.next().value
}
