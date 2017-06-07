import Anomalies from './Anomalies'
import ActionTypeMap from './ActionTypeMap'
import TrackIDManager from './TrackIDManager'

const aTrackIDManager = new TrackIDManager()
const utils: {
  getActionTypeMap(): object;

  generateTrackID(): string;
  resetTrackID(): void;

  hasGetter(descriptor: PropertyDescriptor): boolean;
  hasMethod(descriptor: PropertyDescriptor): boolean;
  hasSetter(descriptor: PropertyDescriptor): boolean;

  isAnomaly(target: string, action: PropertyKey): boolean;
  isTrackAction(target: string, action: PropertyKey): boolean;
} = {
    getActionTypeMap() {
      return ActionTypeMap
    },

    generateTrackID() {
      return aTrackIDManager.generateID()
    },
    resetTrackID() {
      return aTrackIDManager.resetID()
    },

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
    isTrackAction(target, action) {
      return ActionTypeMap[target].hasOwnProperty(action)
    }
  }
export default utils