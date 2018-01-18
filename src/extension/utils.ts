export function isTestEnv() {
  const __karma__ = (<any>window).__karma__

  return __karma__ && __karma__.config.env === 'test'
}  