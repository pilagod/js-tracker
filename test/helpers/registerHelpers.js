module.exports = (helpers) => {
  for (const helper in helpers) {
    global[helper] = helpers[helper]
  }
}
