import * as React from 'react'

export default {
  wrapperFactory(component: any) {
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
}