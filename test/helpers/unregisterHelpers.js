module.exports = (helpers) => {
  for (const helper in helpers) {
    delete global[helper]
  }
}
