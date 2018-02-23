interface Snapshottable<T> {
  getInstance(): T;
  saveSnapshot(): void;
  restoreSnapshot(): void;
}
class SnapshotContainer<T> implements Snapshottable<T> {

  private snapshots: T[] = []
  private instance: T
  private ctr: new (...args: any[]) => T
  private ctrInitArgs: any[]

  constructor(
    ctr: new (...args: any[]) => T,
    ...ctrInitArgs: any[]
  ) {
    this.ctr = ctr
    this.ctrInitArgs = ctrInitArgs
    this.initInstance()
  }

  public getInstance() {
    return this.instance
  }

  public saveSnapshot() {
    this.snapshots.push(this.instance)
    this.initInstance()
  }

  public restoreSnapshot() {
    this.instance = this.snapshots.pop()
  }

  /* private */

  private initInstance() {
    this.instance = new this.ctr(...this.ctrInitArgs)
  }
}
export default function snapshottify<T extends object>(ctr: new (...args: any[]) => T, ...ctrInitArgs: any[]): T & Snapshottable<T> {
  const container: Snapshottable<T> =
    new SnapshotContainer(ctr, ...ctrInitArgs)
  return <T & Snapshottable<T>>new Proxy(container, {
    get: function (target, prop) {
      return target[prop]
        ? target[prop]
        : target.getInstance()[prop].bind(target.getInstance())
    }
  })
}