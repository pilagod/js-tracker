import * as React from 'react'

export default function wrapperFactory(component: React.ComponentClass) {
  return class extends React.Component {
    constructor(props) {
      super(props)

      this.state = Object.assign({}, this.props)
    }
    render() {
      return React.createElement(component, this.state)
    }
  }
}
