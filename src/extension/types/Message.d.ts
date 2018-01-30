/// <reference path='../../tracker/types/ActionStore.d.ts'/>

/* message between contentscript, background, devtool */

type Message = {
  records: ActionRecord[];
  selectionChanged: boolean;
}
