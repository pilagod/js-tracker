module.exports = () => {
  const closure = {}
  return {
    get(name) {
      return closure[name]
    },
    set(name, value) {
      closure[name] = value
    }
  }
}
