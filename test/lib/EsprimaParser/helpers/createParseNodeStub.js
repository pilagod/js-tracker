module.exports = () => {
  return (node) => {
    return `parsed${node.type}`
  }
}
