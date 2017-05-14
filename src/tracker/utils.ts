const utils: {
  isMethodDescriptor(descriptor: PropertyDescriptor): boolean;
  isSettableDescriptor(descriptor: PropertyDescriptor): boolean;
} = {
    isMethodDescriptor(descriptor) {
      return !!descriptor.value && (typeof descriptor.value === 'function')
    },
    isSettableDescriptor(descriptor) {
      return !!descriptor.set
    },
  }
export default utils