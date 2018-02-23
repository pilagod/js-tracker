/// <reference path='../public/types/SourceLocation.d.ts'/>
/// <reference path='./types/ActionData.d.ts'/>

import snapshottify from './libs/snapshottify'
import Brokers from './ActionRecorderBrokers'

interface Recorder extends
  RecorderFunctioner,
  RecorderController { }

interface RecorderController {
  isRecording(): boolean;
  startRecording(context: SourceLocation): void;
  stopRecording(context: SourceLocation): void;

  isPausing(): boolean;
  startPausing(): void;
  stopPausing(): void;

  getRecordContext(): SourceLocation;
}

type RecorderBrokers = {
  'add': new () => Broker
}

interface Broker {
  flush(context: SourceLocation): void;
  process(data: ActionData): void;
}

interface RecorderFunctioner {
  record(action: keyof RecorderBrokers, data: ActionAddData): void;
}

class ActionRecorder implements Recorder {

  private brokers: { [role: string]: Broker } = {}
  private context: SourceLocation = null
  private pause: boolean = false

  constructor(brokers: RecorderBrokers) {
    for (const broker of Object.keys(brokers)) {
      this.brokers[broker] = new brokers[broker]()
    }
  }

  /* controller */

  public isPausing() {
    return this.pause
  }

  public isRecording() {
    return !!this.context
  }

  public getRecordContext() {
    return this.context
  }

  public startRecording(context: SourceLocation) {
    if (!this.context) {
      this.context = context
    }
  }

  public stopRecording(context: SourceLocation) {
    if (this.context === context) {
      this.flush(this.context)
      this.context = null
    }
  }

  public startPausing() {
    this.pause = true
  }

  public stopPausing() {
    this.pause = false
  }

  /* functioner */

  public record(action: keyof RecorderBrokers, data: ActionAddData) {
    if (this.pause) {
      return
    }
    this.brokers[action].process(data)
  }

  /* private */

  private flush(context: SourceLocation) {
    for (const broker of Object.keys(this.brokers)) {
      this.brokers[broker].flush(context)
    }
  }
}
export default snapshottify(ActionRecorder, Brokers)
export { Broker, RecorderBrokers }