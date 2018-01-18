declare const __karma__

export function isTestEnv() {
  return __karma__ && __karma__.config.env === 'test'
}  