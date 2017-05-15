import SpecialCases from './SpecialCases'

const utils: {
  isMethodDescriptor(descriptor: PropertyDescriptor): boolean;
  isSettableDescriptor(descriptor: PropertyDescriptor): boolean;
  isSpecialCase(target, action: PropertyKey): boolean;
} = {
    isMethodDescriptor(descriptor) {
      return !!descriptor.value && (typeof descriptor.value === 'function')
    },
    isSettableDescriptor(descriptor) {
      return !!descriptor.set
    },
    isSpecialCase(target, action) {
      return SpecialCases.hasOwnProperty(target)
        && SpecialCases[target].hasOwnProperty(action)
    }
  }
export default utils