/// <reference path="tracker.d.ts"/>

interface IActionStore {
  register(data: ActionRecord): void;
  retrieve(trackid: string): any;
}
