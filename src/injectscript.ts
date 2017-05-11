import { ActionTypes, ActionTypesMap, Utils } from './tracker/ActionTypes'

(function (global) {
  // @TODO: setup tracker
  // @TODO: attributes, classList, dataset, style all needs parent information
  const TrackIDManager = (function () {
    let trackid = 0
    return {
      generateID() {
        return trackid++
      }
    }
  })()
  for (let [ctr, actionTypesMap] of Object.entries(ActionTypesMap)) {
    const proto = global[ctr].prototype

    Object.getOwnPropertyNames(proto).forEach((prop) => {
      if (Utils.isSimpleActionType(actionTypesMap, prop)) {
        Object.defineProperty(
          proto,
          prop,
          propDecorator(proto, prop, actionTypesMap[prop])
        )
      }
    })
  }
  function propDecorator(
    proto: object,
    prop: string,
    actionType: ActionTypes
  ): PropertyDescriptor {
    const descriptor = Object.getOwnPropertyDescriptor(proto, prop)

    if (Utils.isMethodDescriptor(descriptor)) {
      descriptor.value = methodDecorator(descriptor.value, actionType)
    } else if (Utils.isWritableDescriptor(descriptor)) {
      descriptor.set = setterDecorator(descriptor.set, actionType)
    }
    return descriptor
  }
  function methodDecorator(
    method: (...args: any[]) => any,
    actionType: ActionTypes
  ): (...args: any[]) => any {
    return function (...args) {
      return method.call(this, ...args)
    }
  }
  function setterDecorator(
    setter: PropertyDescriptor['set'],
    actionType: ActionTypes
  ): PropertyDescriptor['set'] {
    return function (value) {
      return setter.call(this, value)
    }
  }
})(window)










