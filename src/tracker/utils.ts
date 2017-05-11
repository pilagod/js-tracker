const _: {
  isSimpleActionType(actionTypesMap: object, prop: string): boolean;
  isMethodDescriptor(descriptor: PropertyDescriptor): boolean;
  isWritableDescriptor(descriptor: PropertyDescriptor): boolean;
} = {
    isSimpleActionType(actionTypesMap, prop) {
      return actionTypesMap.hasOwnProperty(prop) && Number.isInteger(actionTypesMap[prop])
    },
    isMethodDescriptor(descriptor) {
      return !!descriptor.value && (typeof descriptor.value === 'function')
    },
    isWritableDescriptor(descriptor) {
      return !!descriptor.set
    }
  }
export default _