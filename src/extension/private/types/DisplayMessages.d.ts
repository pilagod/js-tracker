/// <reference path='./ActionRecordStore.d.ts'/>

/* messages between contentscript, background, devtool for displaying records */

type DisplayMessage = {
  records: ActionRecord[];
  selectionChanged: boolean;
}
