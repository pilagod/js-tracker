/// <reference path='../tracker/public/ActionStore.d.ts'/>

type Message = {
  records: ActionRecord[];
  shouldTagDiffs: boolean;
}
