/// <reference path='./ActionRecordStore.d.ts'/>

/* message between contentscript, background, devtool */

type Message = {
  records: ActionRecord[];
  selectionChanged: boolean;
}
