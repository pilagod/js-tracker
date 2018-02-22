import { RECORD_STORE_ADD } from '../../extension/public/RecordStoreActions'
import { Broker } from './ActionRecorder'
import { sendMessageToRecordStore } from './NativeUtils'

class ActionAdder implements Broker {

  private data: ActionAddData[] = []

  public flush(context: SourceLocation) {
    if (this.data.length === 0) {
      return
    }
    sendMessageToRecordStore(RECORD_STORE_ADD, {
      loc: context,
      data: this.data
    })
    this.data = []
  }

  public process(data: ActionAddData) {
    this.data.push(data)
  }
}
export default {
  'adder': ActionAdder
}