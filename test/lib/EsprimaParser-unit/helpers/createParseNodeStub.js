module.exports = () => {
  return (node) => {
    return node ? `parsed${node.type}` : undefined
  }
}
