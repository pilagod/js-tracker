module.exports = (type, props) => {
  if (props) {
    return Object.assign({}, {
      type
    }, props)
  }
  return {
    type
  }
}
