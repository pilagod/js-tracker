/// <reference path='ActionStore.d.ts'/>

export default class ActionStore implements IActionStore {

  constructor() {
    this._store = new Store()
    this._locmap = new LocMap()
  }

  /* public */

  public get(trackid: TrackID): ActionRecord[] {
    return this._store.get(trackid)
  }

  public register(trackid: TrackID, record: ActionRecord): void {
    if (!this._locmap.has(trackid, record.source.loc)) {
      this._store.add(trackid, record)
      this._locmap.add(trackid, record.source.loc)
    }
  }

  public registerFromActionInfo(info: ActionInfo): void {

  }

  /* private */

  private _store: IStore
  private _locmap: ILocMap

  private transformActionInfoIntoActionRecord(info: ActionInfo): ActionRecord {
    return <any>{}
  }
}

class Store {

  constructor() {
    this._ = {}
  }

  /* public */

  public add(trackid: TrackID, record: ActionRecord): void {
    if (!this._[trackid]) {
      this._[trackid] = []
    }
    this._[trackid].push(record)
  }

  public get(trackid: TrackID): ActionRecord[] {
    return this._[trackid]
  }

  /* private */

  private _: {
    [trackid in TrackID]: ActionRecord[]
  }
}

class LocMap implements ILocMap {

  constructor() {
    this._ = {}
  }

  /* public */

  public add(trackid: TrackID, loc: string): void {
    if (!this._[loc]) {
      this._[loc] = {}
    }
    this._[loc][trackid] = true
  }

  public has(trackid: TrackID, loc: string): boolean {
    return this._[loc] && this._[loc][trackid]
  }

  /* private */

  private _: {
    [loc: string]: {
      [trackid in TrackID]: boolean;
    };
  }
}

