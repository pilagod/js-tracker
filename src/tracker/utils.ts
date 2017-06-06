import Anomalies from './Anomalies'

const Utils: {
  hasGetter(descriptor: PropertyDescriptor): boolean;
  hasMethod(descriptor: PropertyDescriptor): boolean;
  hasSetter(descriptor: PropertyDescriptor): boolean;
  isAnomaly(target, action: PropertyKey): boolean;
} = {
    hasGetter(descriptor) {
      return !!descriptor.get
    },
    hasMethod(descriptor) {
      return !!descriptor.value && (typeof descriptor.value === 'function')
    },
    hasSetter(descriptor) {
      return !!descriptor.set
    },
    isAnomaly(target, action) {
      return Anomalies.hasOwnProperty(target)
        && Anomalies[target].hasOwnProperty(action)
    },
  }
export default Utils