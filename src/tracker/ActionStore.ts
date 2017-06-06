/// <reference path="tracker.d.ts" />

export default class ActionStore implements IActionStore {
  /* public */

  public register(record: ActionRecord) { }
  public retrieve(trackid: string) { }

  /* private */

  private store: {
    [key: string]: Array<ActionRecord>
  } = {};
}

