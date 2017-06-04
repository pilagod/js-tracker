import Anomalies from './Anomalies'

const Utils: {
  isAnomaly(target, action: PropertyKey): boolean;
  isMethodDescriptor(descriptor: PropertyDescriptor): boolean;
  isSettableDescriptor(descriptor: PropertyDescriptor): boolean;
} = {
    isAnomaly(target, action) {
      return Anomalies.hasOwnProperty(target)
        && Anomalies[target].hasOwnProperty(action)
    },
    isMethodDescriptor(descriptor) {
      return !!descriptor.value && (typeof descriptor.value === 'function')
    },
    isSettableDescriptor(descriptor) {
      return !!descriptor.set
    },
  }
export default Utils