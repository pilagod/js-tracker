/// <reference path='../public/types/SourceLocation.d.ts'/>
/// <reference path='./types/ActionData.d.ts'/>

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

interface RecorderFunctioner {
  add(data: ActionAddData): void;
}

type RecorderBrokers = {
  'adder': new () => Broker
}

interface Broker {
  flush(context: SourceLocation): void;
  process(data: ActionData): void;
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

  public add(data: ActionAddData) {
    if (this.pause) {
      return
    }
    this.brokers.adder.process(data)
  }

  /* private */

  private flush(context: SourceLocation) {
    for (const broker of Object.keys(this.brokers)) {
      this.brokers[broker].flush(context)
    }
  }
}

interface RecorderSnaphotter {
  saveSnapshot(): void;
  restoreSnapshot(): void;
}

class ActionRecorderMaster implements Recorder, RecorderSnaphotter {

  private recorder: Recorder
  private snapshots: Recorder[] = []

  constructor(
    private Recorder: new (Brokers: RecorderBrokers) => Recorder,
    private Brokers: RecorderBrokers
  ) {
    this.initRecorder()
  }

  /* controller */

  public isPausing() {
    return this.recorder.isPausing()
  }

  public isRecording() {
    return this.recorder.isRecording()
  }

  public getRecordContext() {
    return this.recorder.getRecordContext()
  }

  public startRecording(context: SourceLocation) {
    this.recorder.startRecording(context)
  }

  public stopRecording(context: SourceLocation) {
    this.recorder.stopRecording(context)
  }

  public startPausing() {
    this.recorder.startPausing()
  }

  public stopPausing() {
    this.recorder.stopPausing()
  }

  public saveSnapshot() {
    this.snapshots.push(this.recorder)
    this.initRecorder()
  }

  public restoreSnapshot() {
    this.recorder = this.snapshots.pop()
  }

  /* functioner */

  public add(data: ActionAddData) {
    this.recorder.add(data)
  }

  /* private */

  private initRecorder() {
    this.recorder = new this.Recorder(this.Brokers)
  }
}
export default new ActionRecorderMaster(ActionRecorder, Brokers)
export { Broker }