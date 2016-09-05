module.exports = (...args) => {
  for (const arg of args) {
    delete global[arg]
  }
}
